import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PrintingData {
  programNo: number;
  date: string;
  customer: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrintingService {
  private printingData: PrintingData[] = [
    { programNo: 1, date: '28-09-2023', customer: 'EMCO TEXTILE' }
  ];

  constructor() {}

  getPrintingData(): Observable<PrintingData[]> {
    return of(this.printingData);
  }

  addPrinting(data: PrintingData): Observable<PrintingData> {
    const newPrinting = {
      ...data,
      programNo: this.printingData.length + 1
    };
    this.printingData.push(newPrinting);
    return of(newPrinting);
  }

  updatePrinting(data: PrintingData): Observable<PrintingData> {
    const index = this.printingData.findIndex(item => item.programNo === data.programNo);
    if (index !== -1) {
      this.printingData[index] = data;
      return of(data);
    }
    throw new Error('Printing record not found');
  }

  deletePrinting(programNo: number): Observable<void> {
    const index = this.printingData.findIndex(item => item.programNo === programNo);
    if (index !== -1) {
      this.printingData.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Printing record not found');
  }
}
