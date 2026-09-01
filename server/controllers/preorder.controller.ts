import { Request, Response } from 'express';
import { db } from '../repository/db';
import { Reservation } from '../models/types';
import { resourceService } from '../services/resource.service';
import { auditService } from '../services/audit.service';
import { emailService } from '../services/email.service';

const EXPECTED_LAUNCH_WINDOW = 'Q4 2026';

export class PreOrderController {
  /**
   * GET /api/preorder/allocation-status
   */
  public async getAllocationStatus(req: Request, res: Response) {
    const stats = db.getAllocationStats();
    return res.status(200).json(stats);
  }

  /**
   * POST /api/preorder/reserve
   */
  public async createReservation(req: Request, res: Response) {
    try {
      const {
        fullName,
        email,
        discordUsername,
        country,
        planId,
        billingCycle,
        datacenterLocation,
        intendedUse,
        intendedUseOther,
        operatingSystem,
        tellUsMore,
        addonInterests,
        phoneNumber,
        company,
        existingVpsProvider,
        referralSource,
        confirmationAgreed,
      } = req.body;

      // Backend validation
      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Full Name is required.' });
      }

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Validation Error', message: 'A valid Email Address is required.' });
      }

      if (!discordUsername || !discordUsername.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Discord Username is required.' });
      }

      if (!country || !country.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Country selection is required.' });
      }

      if (!planId) {
        return res.status(400).json({ error: 'Validation Error', message: 'Selected VPS Plan is required.' });
      }

      if (!intendedUse) {
        return res.status(400).json({ error: 'Validation Error', message: 'Intended Use selection is required.' });
      }

      if (!operatingSystem) {
        return res.status(400).json({ error: 'Validation Error', message: 'Operating System selection is required.' });
      }

      if (!confirmationAgreed) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'You must confirm that you authorize pre-order payment today.',
        });
      }

      // Check real backend founding allocation availability
      const allocationStats = db.getAllocationStats();
      const isEligibleForBonus = allocationStats.isBonusActive && !['nano', 'starter'].includes(planId.toLowerCase());

      // Server-side resource calculation
      const resources = resourceService.calculateResources(planId, isEligibleForBonus);

      // Generate unique Reservation ID
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const reservationId = `KH-PRE-${randomDigits}`;
      const customerId = `usr-cust-${Date.now()}`;

      const newReservation: Reservation = {
        reservationId,
        customerId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        discordUsername: discordUsername.trim(),
        country,
        planId: resources.planId,
        planName: resources.planName,
        datacenterLocation: datacenterLocation || 'India - Mumbai',
        billingCycle: billingCycle || '1 Month (Monthly)',
        monthlyPriceUSD: resources.monthlyPriceUSD,
        monthlyPriceINR: resources.monthlyPriceINR,
        baseRamGB: resources.baseRamGB,
        bonusRamGB: resources.foundingBonusRamGB,
        finalRamGB: resources.finalRamGB,
        vcpu: resources.vcpu,
        storageGB: resources.storageGB,
        operatingSystem,
        intendedUse,
        intendedUseOther: intendedUse === 'Other' ? intendedUseOther : undefined,
        tellUsMore,
        addonInterests: Array.isArray(addonInterests) ? addonInterests : [],
        phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
        company: company ? company.trim() : undefined,
        existingVpsProvider: existingVpsProvider ? existingVpsProvider.trim() : undefined,
        referralSource: referralSource ? referralSource.trim() : undefined,
        status: 'RESERVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save reservation to persistent DB
      db.getReservations().push(newReservation);
      db.save();

      // Log Security Audit Event
      auditService.logAction(
        customerId,
        'customer',
        'PREORDER_RESERVATION_CREATED',
        reservationId,
        undefined,
        {
          planId: resources.planId,
          datacenterLocation: newReservation.datacenterLocation,
          bonusRamGB: resources.foundingBonusRamGB,
          finalRamGB: resources.finalRamGB,
          email: newReservation.email,
        }
      );

      console.log(`[PreOrderController] Pre-order reservation ${reservationId} created for ${fullName} (${email}). Location: ${newReservation.datacenterLocation}, RAM: ${resources.finalRamGB}GB`);

      return res.status(201).json({
        success: true,
        message: '🎉 Founding Allocation Reserved successfully.',
        reservation: {
          reservationId: newReservation.reservationId,
          planName: newReservation.planName,
          datacenterLocation: newReservation.datacenterLocation,
          baseResources: {
            vcpu: newReservation.vcpu,
            baseRamGB: newReservation.baseRamGB,
            storageGB: newReservation.storageGB,
          },
          foundingBonus: newReservation.bonusRamGB > 0 ? `+${newReservation.bonusRamGB} GB RAM permanently` : 'None',
          launchAllocation: {
            ramGB: newReservation.finalRamGB,
            vcpu: newReservation.vcpu,
            storageGB: newReservation.storageGB,
          },
          paymentStatus: 'PAID',
          status: 'PREORDER_CONFIRMED',
          expectedLaunch: EXPECTED_LAUNCH_WINDOW,
          createdAt: newReservation.createdAt,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Reservation Error', message: err.message });
    }
  }

  /**
   * POST /api/preorder/test-email
   */
  public async sendTestEmail(req: Request, res: Response) {
    const targetEmail = req.body?.email || 'tejasjha.in@gmail.com';
    const result = await emailService.sendTestEmail(targetEmail);
    return res.status(200).json({
      success: true,
      message: `⚡ Test notification email dispatched to ${targetEmail}`,
      details: result,
    });
  }
}

export const preOrderController = new PreOrderController();
