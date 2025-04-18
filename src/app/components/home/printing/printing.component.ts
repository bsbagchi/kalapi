import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../reuse/header/header.component';
import { FormsModule } from '@angular/forms';
import { PrintingService } from '../../../services/printing.service';

interface PrintingData {
  programNo: number;
  date: string;
  customer: string;
}

@Component({
  selector: 'app-printing',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './printing.component.html',
})
export class PrintingComponent implements OnInit {
  constructor(private printingService: PrintingService) {}
  title = 'Printing';
  searchTerm = '';
  isCalendarOpen = false;
  selectedDateRange = 'Filter by date';
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  currentMonth = new Date();
  nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);

  currentMonthDates: Date[] = [];
  nextMonthDates: Date[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  printingData: PrintingData[] = [
    { programNo: 1, date: '28-09-2023', customer: 'EMCO TEXTILE' }
  ];
  filteredData: PrintingData[] = [];

  ngOnInit() {
    this.printingService.getPrintingData().subscribe(data => {
      this.printingData = data;
      this.filteredData = [...this.printingData];
    });
    this.generateCalendarDates();
  }

  generateCalendarDates() {
    this.currentMonthDates = this.getDatesForMonth(this.currentMonth);
    this.nextMonthDates = this.getDatesForMonth(this.nextMonth);
  }

  navigateMonth(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
      this.nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    } else {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
      this.nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    }
    this.generateCalendarDates();
  }

  getDatesForMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates: Date[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      dates.push(new Date(year, month, -firstDay.getDay() + i + 1));
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }

    // Add empty slots for days after the last day of the month
    const remainingDays = 42 - dates.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(year, month + 1, i));
    }

    return dates;
  }

  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  selectDate(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else {
      if (date < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = date;
      } else {
        this.endDate = date;
      }
    }
  }

  isDateSelected(date: Date): boolean {
    if (!date) return false;
    return (
      (this.startDate !== null && date.getTime() === this.startDate.getTime()) ||
      (this.endDate !== null && date.getTime() === this.endDate.getTime())
    );
  }

  isDateInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  clearDateRange() {
    this.startDate = null;
    this.endDate = null;
    this.selectedDateRange = 'Filter by date';
    this.filteredData = [...this.printingData];
  }

  applyDateRange() {
    if (this.startDate && this.endDate) {
      this.selectedDateRange = `${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}`;
      this.applyFilter();
    } else if (this.startDate) {
      this.selectedDateRange = this.formatDate(this.startDate);
      this.applyFilter();
    }
    this.isCalendarOpen = false;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  applyFilter() {
    this.filteredData = this.printingData.filter(item => {
      const matchesSearch = item.customer.toLowerCase().includes(this.searchTerm.toLowerCase());
      const itemDate = new Date(item.date);

      const withinDateRange = (!this.startDate || itemDate >= this.startDate) &&
                             (!this.endDate || itemDate <= this.endDate);

      return matchesSearch && withinDateRange;
    });
  }

  addPrinting() {
    const newPrinting = {
      programNo: 0,
      date: new Date().toLocaleDateString('en-GB'),
      customer: 'New Customer'
    };
    this.printingService.addPrinting(newPrinting).subscribe(data => {
      this.printingData.push(data);
      this.applyFilter();
    });
  }

  editPrinting(programNo: number) {
    const printing = this.printingData.find(p => p.programNo === programNo);
    if (printing) {
      const updatedPrinting = { ...printing, customer: printing.customer + ' (Updated)' };
      this.printingService.updatePrinting(updatedPrinting).subscribe(data => {
        const index = this.printingData.findIndex(p => p.programNo === programNo);
        if (index !== -1) {
          this.printingData[index] = data;
          this.applyFilter();
        }
      });
    }
  }

  deletePrinting(programNo: number) {
    this.printingService.deletePrinting(programNo).subscribe(() => {
      this.printingData = this.printingData.filter(p => p.programNo !== programNo);
      this.applyFilter();
    });
  }
}
