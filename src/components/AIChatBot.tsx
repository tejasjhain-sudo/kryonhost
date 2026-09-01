import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2, Server, HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, RefreshCw, MessageSquare, Zap, Terminal, Code } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
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

  // Auto-dismiss welcome tooltip after 12 seconds
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
    sender: 'ai',
    text: `👋 **Hello! I am your KryonHost AI Specialist.**

I can answer any question about:
• **KryonHost VPS Plans & Mumbai Node Specs**
• **Custom Month Discounts (Up to 30% OFF)** & **Cashfree Payments**
• **Linux Commands, Docker, Nginx, Node.js & Server Setup**
• **Server Security, SSH Keys & Optimization**

How can I assist your setup today?`,
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

  // Universal Expert AI Knowledge Engine
  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase();

    // 1. KryonHost Plans & Pricing
    if (q.includes('plan') || q.includes('price') || q.includes('cost') || q.includes('cheap') || q.includes('rate') || q.includes('tier')) {
      return `⚡ **KryonHost VPS Plans (India - Mumbai Datacenter)**:

1. **Starter**: 2 vCPU / 4 GB RAM (+4GB Bonus = 8GB) / 50 GB NVMe — **₹349/mo** ($4.29)
2. **Performance**: 4 vCPU / 8 GB RAM (+4GB Bonus = 12GB) / 100 GB NVMe — **₹599/mo** ($7.49) ⭐ *Most Popular*
3. **Pro**: 6 vCPU / 16 GB RAM (+4GB Bonus = 20GB) / 200 GB NVMe — **₹1,199/mo** ($14.99)
4. **Enterprise**: 8 vCPU / 32 GB RAM (+4GB Bonus = 36GB) / 400 GB NVMe — **₹2,399/mo** ($29.99)
5. **Extreme**: 16 vCPU / 64 GB RAM (+4GB Bonus = 68GB) / 800 GB NVMe — **₹4,799/mo** ($59.99)

💡 *Tip: Pre-ordering for 12+ custom months via Cashfree saves up to 25% OFF!*`;
    }

    // 2. Founding Bonus RAM
    if (q.includes('bonus') || q.includes('ram') || q.includes('4gb') || q.includes('founding') || q.includes('allocation') || q.includes('slot')) {
      return `🎉 **+4 GB Permanent Founding RAM Bonus**:
All early pre-orders locked in today receive a **permanent +4 GB RAM upgrade** for the lifetime of your server!

• **Current Allocation Status**: 28 of 30 Founding Slots Remaining.
• **Activation**: Applied automatically at checkout on all eligible plans.`;
    }

    // 3. Datacenter Location & Latency
    if (q.includes('location') || q.includes('mumbai') || q.includes('datacenter') || q.includes('ping') || q.includes('latency') || q.includes('india') || q.includes('server')) {
      return `🇮🇳 **India - Mumbai Datacenter Specs**:
• **Tier IV Facility** with N+2 power & cooling redundancy.
• **1 Gbps Unmetered Uplink Port** with domestic NIXI & IX-India peering.
• Sub-15ms latency across Mumbai, Delhi, Bengaluru, Hyderabad & Chennai.`;
    }

    // 4. Cashfree Payment Gateway
    if (q.includes('payment') || q.includes('cashfree') || q.includes('upi') || q.includes('card') || q.includes('gpay') || q.includes('paytm') || q.includes('phonepe')) {
      return `💳 **Cashfree Payments Gateway**:
We process instant pre-orders securely via **Cashfree**:
• **UPI & QR**: Google Pay, PhonePe, Paytm, BHIM UPI.
• **Cards**: Visa, Mastercard, RuPay Credit & Debit Cards.
• **NetBanking**: Supported across 50+ major Indian banks.`;
    }

    // 5. Custom Duration Discounts
    if (q.includes('discount') || q.includes('month') || q.includes('year') || q.includes('term') || q.includes('duration') || q.includes('save')) {
      return `🔥 **Custom Duration Tiered Discounts**:
Choose any custom duration from 1 to 36 months on checkout:
• **3–5 Months**: 5% OFF
• **6–11 Months**: 10% OFF
• **12–23 Months**: 15% OFF
• **24–35 Months**: 25% OFF
• **36+ Months**: 30% MAX SAVINGS OFF`;
    }

    // 6. Docker & Container Guidance
    if (q.includes('docker') || q.includes('container') || q.includes('portainer') || q.includes('compose')) {
      return `🐳 **How to Install Docker & Docker Compose on Ubuntu**:

Run the following commands on your KryonHost VPS:
\`\`\`bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
\`\`\`
To deploy Portainer Web GUI:
\`\`\`bash
docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ce:latest
\`\`\`
Visit \`http://your-server-ip:9000\` to open your dashboard!`;
    }

    // 7. Nginx & Reverse Proxy Setup
    if (q.includes('nginx') || q.includes('proxy') || q.includes('domain') || q.includes('ssl') || q.includes('certbot')) {
      return `🌐 **Nginx Reverse Proxy & Free SSL Setup**:

1. Install Nginx & Certbot:
\`\`\`bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
\`\`\`
2. Configure \`/etc/nginx/sites-available/yourdomain.conf\`:
\`\`\`nginx
server {
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
\`\`\`
3. Issue Free SSL:
\`\`\`bash
sudo certbot --nginx -d yourdomain.com
\`\`\``;
    }

    // 8. SSH & Security Best Practices
    if (q.includes('ssh') || q.includes('security') || q.includes('ufw') || q.includes('firewall') || q.includes('password') || q.includes('root')) {
      return `🔒 **Server Security Best Practices**:

1. **Enable UFW Firewall**:
\`\`\`bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
\`\`\`
2. **Add SSH Public Key**:
Copy your key into \`~/.ssh/authorized_keys\` on your KryonHost VPS.`;
    }

    // 9. Node.js & Web App Deployment
    if (q.includes('node') || q.includes('express') || q.includes('python') || q.includes('pm2') || q.includes('app') || q.includes('deploy')) {
      return `🚀 **Node.js Production Setup with PM2**:

1. Install Node.js LTS & PM2:
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
\`\`\`
2. Start app with auto-restart:
\`\`\`bash
pm2 start server.js --name "my-app"
pm2 save && pm2 startup
\`\`\``;
    }

    // 10. General / Greetings / Helpful Fallback
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('help')) {
      return `👋 **Hello! How can I assist you today?**

You can ask me about:
• KryonHost VPS Plans & +4 GB RAM Bonus
• Cashfree Payment Gateway & Discounts
• Deploying Docker, Nginx, Node.js, or Python apps
• Setting up SSH keys & server security`;
    }

    // Universal Helpful Answer
    return `I am happy to assist you with your request!

Regarding **"${query}"**:
• If you need guidance on **KryonHost VPS plans**, we offer high-performance NVMe servers starting at **₹349/mo** with a **+4 GB Founding RAM bonus**.
• If you need **Linux server administration**, **Docker setup**, or **application deployment**, let me know what stack you are building and I will provide full step-by-step terminal commands!

How would you like to proceed?`;
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
      const aiReply = generateAIResponse(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  const quickPrompts = [
    'What VPS plans do you offer?',
    'How to install Docker & Portainer?',
    'Tell me about India - Mumbai Datacenter',
    'How to setup Nginx & SSL?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Proactive Welcome Tooltip Popup on Homepage */}
      {!isOpen && showWelcomeTooltip && (
        <div className="absolute bottom-16 right-0 w-72 p-4 rounded-2xl bg-slate-900/95 text-white border border-[#0096C7]/40 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300 font-sans z-50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0096C7] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-black font-mono text-[#38BDF8]">KryonHost Assistant</span>
            </div>
            <button
              onClick={() => setShowWelcomeTooltip(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
            👋 Have questions about our <strong className="text-white">India - Mumbai VPS</strong> or <strong className="text-[#38BDF8]">+4 GB RAM Bonus</strong>?
          </p>

          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online & Ready
            </span>
            <button
              onClick={handleOpenChat}
              className="px-3 py-1.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white text-xs font-black font-mono shadow-md flex items-center gap-1 transition-all"
            >
              <span>Ask AI Assistant</span>
              <Zap className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Trigger Button - Icon Only */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          aria-label="Open AI Assistant Chat"
          className="relative p-3.5 rounded-full bg-[#0096C7] hover:bg-[#0284C7] text-white shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center cursor-pointer border border-white/20 group"
        >
          <div className="relative">
            <Bot className="w-7 h-7 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-slate-950/95 border border-[#0096C7]/40 text-white rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Top Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#0096C7] text-white shadow-md shadow-[#0096C7]/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black flex items-center gap-2 font-mono">
                  <span>KryonHost Universal AI</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                    ONLINE 🟢
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">VPS Specs, Pricing & Linux Administration</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-[#0096C7] text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[84%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-sm font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#0096C7] text-white rounded-br-none font-medium'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[9px] font-mono text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#38BDF8]" />
                <span>KryonHost AI is processing your request...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Choice Prompts */}
          <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-[#0096C7]/30 text-slate-300 hover:text-white font-bold whitespace-nowrap transition-colors border border-slate-700/60 shrink-0"
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
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about VPS, Docker, Nginx, Cashfree..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0096C7]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#0096C7] hover:bg-[#0284C7] text-white disabled:opacity-40 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Branding */}
          <div className="py-2 px-4 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500 font-mono text-center flex items-center justify-between">
            <span>KryonHost Universal AI Assistant</span>
            <button
              onClick={() => onOpenPreOrder('performance')}
              className="text-[#38BDF8] font-bold hover:underline"
            >
              Pre-Order VPS →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
