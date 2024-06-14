import { Component, OnInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeTab: string = 'movies';
  isSearchFocused: boolean = false;
  searchQuery: string = '';

  @Output() activeTabEmitter = new EventEmitter<string>();
  @Output() searchQueryEmitter = new EventEmitter<string>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.updateIndicator();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.updateIndicator();
    this.activeTabEmitter.emit(tab);
  }

  updateIndicator(): void {
    const indicator = this.elementRef.nativeElement.querySelector('.tab-indicator');
    const activeTabElement = this.elementRef.nativeElement.querySelector(`.${this.activeTab}-tab`);

    if (activeTabElement) {
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = this.elementRef.nativeElement.querySelector('.tabs-container').getBoundingClientRect();

      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      this.renderer.setStyle(indicator, 'left', `${left}px`);
      this.renderer.setStyle(indicator, 'width', `${width}px`);
    }
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.searchQueryEmitter.emit(this.searchQuery);
  }
}
