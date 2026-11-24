'use client'

import { kicker } from '@/shared/ui/SectionHeading'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'

export function CrisisModal({ open, onClose, onReturnFocus }: { open: boolean; onClose: () => void; onReturnFocus: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent onCloseAutoFocus={(event) => { event.preventDefault(); onReturnFocus() }}>
        <DialogHeader>
          <span className={kicker}>YOU DESERVE SUPPORT NOW</span>
          <DialogTitle>You do not have to carry this alone.</DialogTitle>
          <DialogDescription>If you may hurt yourself or are in immediate danger, contact emergency services or a trusted person now. OCCS can help you find the next step.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild><a href="tel:1553">Call NCMH · 1553</a></Button>
          <Button asChild variant="outline"><a href="mailto:occs@dlsu.edu.ph">Email OCCS <span aria-hidden="true">↗</span></a></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
