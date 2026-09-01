import { createClient } from '@supabase/supabase-js';
import { ENV_CONFIG } from '../config/env.config';

export const supabaseAdmin = createClient(ENV_CONFIG.SUPABASE_URL, ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export class SupabaseService {
  /**
   * Sync Pre-Order Reservation to Supabase Cloud Database
   */
  public async syncReservation(reservation: any) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .upsert({
          reservation_id: reservation.reservationId,
          customer_id: reservation.customerId,
          full_name: reservation.fullName,
          email: reservation.email,
          discord_username: reservation.discordUsername,
          country: reservation.country,
          plan_id: reservation.planId,
          plan_name: reservation.planName,
          datacenter_location: reservation.datacenterLocation || 'India - Mumbai',
          monthly_price_usd: reservation.monthlyPriceUSD,
          monthly_price_inr: reservation.monthlyPriceINR,
          base_ram_gb: reservation.baseRamGB,
          bonus_ram_gb: reservation.bonusRamGB,
          final_ram_gb: reservation.finalRamGB,
          vcpu: reservation.vcpu,
          storage_gb: reservation.storageGB,
          operating_system: reservation.operatingSystem,
          intended_use: reservation.intendedUse,
          addon_interests: reservation.addonInterests,
          status: reservation.status,
          created_at: reservation.createdAt,
        });

      if (error) {
        console.warn(`[SupabaseService] Reservation sync notice (Local DB fallback active): ${error.message}`);
      } else {
        console.log(`[SupabaseService] Reservation ${reservation.reservationId} synced to Supabase Cloud DB.`);
      }
    } catch (err: any) {
      console.warn(`[SupabaseService] Cloud DB sync fallback: ${err.message}`);
    }
  }
}

export const supabaseService = new SupabaseService();
