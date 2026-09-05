import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Loader2, Server, HelpCircle, Check, Terminal, ShieldCheck, Headphones } from 'lucide-react';

interface Message {
  id: string;
  sender: 'support' | 'user';
  text: string;
  timestamp: string;
}

interface AIChatBotProps {
  onOpenPreOrder: (planId?: string) => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ onOpenPreOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeTooltip(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowWelcomeTooltip(false);
  };

  const initialGreeting: Message = {
    id: 'msg-1',
    sender: 'support',
    text: `👋 **Welcome to KryonHost Technical Desk.**

How can we assist your infrastructure today?
• **VPS Hardware Specs & Tier IV Datacenter**
• **Transparent Pricing & Instant Deployment**
• **Linux Commands, Docker, Nginx & Server Setup**
• **Network Peering & Latency Information**`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateSupportResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('plan') || q.includes('price') || q.includes('cost') || q.includes('cheap') || q.includes('tier') || q.includes('vps')) {
      return `⚡ **KryonHost VPS Categories (Tier IV Mumbai)**:

• **Budget VPS**: Intel Xeon, NVMe, Unlimited Bandwidth — **From ₹379/mo**
• **Standard VPS**: AMD EPYC, DDR4 ECC, 1 Gbps, Snapshots — **From ₹616/mo**
• **Performance VPS**: Intel 12th/13th Gen, High Clock — **From ₹829/mo**
• **Power VPS**: AMD Ryzen 7000 X/X3D, DDR5 ECC, 1 Gbps — **From ₹829/mo**

💡 *Zero hidden fees, zero setup charges, fixed monthly billing.*`;
    }

    if (q.includes('location') || q.includes('mumbai') || q.includes('datacenter') || q.includes('ping') || q.includes('latency') || q.includes('india')) {
      return `🇮🇳 **Datacenter & Peering Specifications**:
• **Facility**: Tier IV Datacenter in Navi Mumbai, India.
• **Peering**: Direct NIXI and ExtremeIX interconnects.
• **Latency**: Sub-5ms domestic ping across major Indian metro hubs.
• **Port**: 1 Gbps full-duplex uplink with redundant fiber paths.`;
    }

    if (q.includes('payment') || q.includes('cashfree') || q.includes('upi') || q.includes('card') || q.includes('billing')) {
      return `💳 **Accepted Payment Methods**:
We process instant payments via **Cashfree Payments**:
• **UPI & QR**: Google Pay, PhonePe, Paytm, BHIM.
• **Credit & Debit Cards**: Visa, Mastercard, RuPay.
• **NetBanking**: Supported across all major Indian banks.`;
    }

    if (q.includes('docker') || q.includes('container') || q.includes('portainer')) {
      return `🐳 **Installing Docker & Portainer on Ubuntu/Debian**:

Run these terminal commands:
\`\`\`bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
\`\`\`

To deploy Portainer Web GUI:
\`\`\`bash
docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ce:latest
\`\`\``;
    }

    if (q.includes('nginx') || q.includes('ssl') || q.includes('domain') || q.includes('certbot')) {
      return `🌐 **Nginx Reverse Proxy & Free SSL**:

1. Install Nginx & Certbot:
\`\`\`bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
\`\`\`
2. Issue SSL Certificate:
\`\`\`bash
sudo certbot --nginx -d yourdomain.com
\`\`\``;
    }

    if (q.includes('contact') || q.includes('support') || q.includes('human') || q.includes('ticket') || q.includes('discord')) {
      return `🎧 **Official Support Desk**:
• **Email**: support@kryonhost.com
• **Phone**: +91 8750287172 (9:00 AM – 5:00 PM IST)
• **Discord**: https://discord.gg/kryonhost`;
    }

    return `Thank you for reaching out to KryonHost Support!

Regarding **"${query}"**:
• We offer high-performance KVM VPS hosting in Tier IV Mumbai starting at **₹379/mo**.
• If you need technical assistance with **Linux server configuration**, **Docker**, **Nginx**, or **network latency**, please specify your requirements and our team will guide you!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateSupportResponse(text);
      const replyMsg: Message = {
        id: `support-${Date.now()}`,
        sender: 'support',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 400);
  };

  const quickPrompts = [
    'VPS Plans & Pricing',
    'Mumbai Datacenter Ping',
    'Docker Installation Guide',
    'Contact Human Support',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Welcome Tooltip Popup */}
      {!isOpen && showWelcomeTooltip && (
        <div className="absolute bottom-16 right-0 w-72 p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl font-sans z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0096C7] text-white">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-mono text-slate-900">Technical Desk</span>
            </div>
            <button
              onClick={() => setShowWelcomeTooltip(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
            Need help selecting a <strong className="text-slate-900">Mumbai VPS plan</strong> or server configuration?
          </p>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Support Online
            </span>
            <button
              onClick={handleOpenChat}
              className="px-3 py-1.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-xs font-heading font-bold shadow-sm flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Chat Desk</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          aria-label="Open Technical Support"
          className="p-3.5 rounded-full bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-xl transition-all hover:scale-105 flex items-center justify-center cursor-pointer border border-white/20 group"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Floating Chat Window - Crisp Light Enterprise Theme */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0096C7] text-white shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-heading font-black flex items-center gap-2 tracking-tight">
                  <span>KryonHost Technical Desk</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Infrastructure & Support Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'support' && (
                  <div className="w-7 h-7 rounded-xl bg-[#0096C7] text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                    <Headphones className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-sm font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#0096C7] text-white rounded-br-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[9px] font-mono text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0096C7]" />
                <span>Support desk is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Choice Prompts */}
          <div className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0096C7] hover:text-white text-slate-700 font-bold whitespace-nowrap transition-colors border border-slate-200 shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your server or pricing question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0096C7]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white disabled:opacity-40 transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
