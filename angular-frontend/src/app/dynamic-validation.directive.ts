import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

@Directive({
  selector: '[appDynamicValidation]',
})
export class DynamicValidationDirective implements OnInit {
  @Input() showError: boolean = true;
  @Input() errorSeverity: string = 'error';

  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private messageService: MessageService,
    private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    timer(0, 5000)  // Check every 5 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateInput();
      });
  }

  private validateInput() {
    const control = this.el.nativeElement;

    if (control) {
      if (this.ngControl.invalid && this.showError) {
        this.addErrorStyles();
      } else {
        this.removeErrorStyles();
        this.hideAlert();
      }
    }
  }

  private addErrorStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid red');
  }

  private removeErrorStyles() {
    this.renderer.removeStyle(this.el.nativeElement, 'border');
  }

  private showAlert(message: string) {
    this.messageService.add({ severity: this.errorSeverity, summary: 'Error', detail: message });
  }

  private hideAlert() {
    // You can customize this method if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
