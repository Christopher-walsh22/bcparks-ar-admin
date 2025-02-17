import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { formulaResult } from 'src/app/services/formula.service';

@Component({
  selector: 'app-other-day-use',
  templateUrl: './other-day-use.component.html',
  styleUrls: ['./other-day-use.component.scss', '../../../../shared/components/forms/base-form/base-form.component.scss']
})
export class OtherDayUseComponent implements OnInit {
  @Input() otherDayUsePeopleHotSpringsField = new UntypedFormControl;
  @Input() otherDayUseRevenueHotSpringsField = new UntypedFormControl;
  @Input() revenueTotal: formulaResult = {result: null, formula: ''};

  constructor() { }

  ngOnInit(): void {
  }

}
