import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormulaService } from 'src/app/services/formula.service';
import { summarySection } from 'src/app/shared/components/accordion/summary-section/summary-section.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-backcountry-cabins-accordion',
  templateUrl: './backcountry-cabins-accordion.component.html',
  styleUrls: ['./backcountry-cabins-accordion.component.scss'],
})
export class BackcountryCabinsAccordionComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public icons = Constants.iconUrls;
  public data;
  public summaries: summarySection[] = [];

  constructor(
    protected dataService: DataService,
    protected formulaService: FormulaService
  ) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.ACCORDION_BACKCOUNTRY_CABINS)
        .subscribe((res) => {
          this.data = res;
          this.buildAccordion();
        })
    );
  }

  buildAccordion() {
    this.summaries = [
      {
        attendanceLabel: 'Total People',
        attendanceItems: [
          {
            itemName: 'Adult (16+)',
            value: this.data?.peopleAdult,
          },
          {
            itemName: 'Child (6-15)',
            value: this.data?.peopleChild,
          },
          {
            itemName: 'Family',
            value: this.data?.peopleFamily,
          },
        ],
        attendanceTotal: this.formulaService.backcountryCabinsAttendance(
          [this.data?.peopleAdult, this.data?.peopleChild],
          [this.data?.peopleFamily],
          this.data?.config?.attendanceModifier
        ),
        revenueLabel: 'Net Revenue',
        revenueItems: [
          {
            itemName: 'Family',
            value: this.data?.revenueFamily,
          },
        ],
        revenueTotal: this.formulaService.basicNetRevenue([
          this.data?.revenueFamily,
        ]),
      },
    ];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
