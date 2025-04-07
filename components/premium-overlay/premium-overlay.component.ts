import { Component } from '@angular/core';
import { AboService } from '../../services/abo';

@Component({
  selector: 'app-premium-overlay',
  templateUrl: './premium-overlay.component.html',
  styleUrls: ['premium-overlay.component.scss']
})
export class PremiumOverlayComponent {
  constructor(public aboService: AboService) {}
}
