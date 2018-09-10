import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueryCondition } from '../../share_platform/framework/util';
import { MetaField } from 'share_platform/framework/entity';


enum View {
  Show = 'show',
  Update = 'update',
  Query = 'query'
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styles: []
})
export class FieldComponent implements OnInit {
  View = View;
  dateRange: Date[] = [];
  @Input() field: MetaField;
  @Input() mode: View = View.Show;
  @Input() value: any;


  @Output() valueChange = new EventEmitter();
  /**日期选择器  */
  selectedDateCondition: { label: string, value: any, datePick?: string };
  selectedCondition;
  date: Date;
  dateFormat = 'yyyy-MM-dd';
  conditions: { label: string, value: any, datePick?: string }[] = [];
  constructor() { }

  selectDateCondition(condition) {
    this.selectedDateCondition = condition;
  }

  initQueryOption() {
    // this.field.t = 'like';
    // console.log(`initQUery`, this.field)
    switch (this.field.fieldType.toLowerCase()) {

      case 'int':
        this.conditions = [
          { label: '大于', 'value': '>' },
          { label: '小于', value: '<' },
          { label: '等于', 'value': '=' },
          { label: '大于等于', value: '>=' },
          { label: '小于等于', value: '<=' }
        ];
        break;
      case 'datetime':
      case 'timestamp':
        console.log(`datetime`, this.field)
        this.conditions = [{ label: '之后', value: '>', datePick: 'single' }, { label: '之前', value: '<', datePick: 'single' }, { label: '之间', value: '<>', datePick: 'between' }];
        this.selectedDateCondition = this.conditions[0];
        break;
      default:
        this.conditions = [{ label: '包含', value: 'like' }, { label: '不包含', value: 'not like' }, { label: '等于', value: '=' }];
        break;
    }
  }

  ngOnInit() {
    if (this.field.fieldType && this.mode == 'query') {
      this.initQueryOption();
    }
  }
  submitChange() {
    console.log(`submit changr:`, this.field)
    switch (this.field.fieldType.toLowerCase()) {
      case 'timestamp':
        console.log(`timestamp submit change`)
        this.valueChange.emit((this.value as Date).getTime());

        break;

      default:
        this.valueChange.emit(this.value);

        break;
    }
    debugger;

  }
  /**
   * 获取查询字段
   */
  public getFieldQueryOptions(): QueryCondition[] {
    let queryContions: QueryCondition[] = [];
    switch (this.field.fieldType.toLowerCase()) {
      case 'int':
      case 'varchar':
        queryContions = [{
          field: this.field.fieldName,
          value: this.value,
          compare: this.selectedCondition,
          andOr: "and"
        }]
        break;
      case 'datetime':
        if (this.selectedDateCondition) {

          switch (this.selectedDateCondition.datePick) {
            case 'single':
              if (this.date) {
                queryContions = [{ field: this.field.fieldName, value: this.date, compare: this.selectedDateCondition.value, andOr: "and" }];
              } else
                queryContions = [];
              break;
            case 'between':
              if (this.dateRange.length == 2)
                queryContions = [{ field: this.field.fieldName, value: this.dateRange[0], compare: '>', andOr: "and" }, { field: this.field.fieldName, value: this.dateRange[1], compare: '<', andOr: "and" }];
              else
                queryContions = [];
              break;
          }
        } else {
          queryContions = [];
        }

      case 'timestamp':
        if (this.selectedDateCondition) {
          switch (this.selectedDateCondition.datePick) {
            case 'single':
              if (this.date) {
                queryContions = [{ field: this.field.fieldName, value: this.date.getTime(), compare: this.selectedDateCondition.value, andOr: "and" }];
              } else
                queryContions = [];
              break;
            case 'between':
              if (this.dateRange.length == 2)
                queryContions = [{ field: this.field.fieldName, value: this.dateRange[0].getTime(), compare: '>', andOr: "and" },
                { field: this.field.fieldName, value: this.dateRange[1].getTime(), compare: '<', andOr: "and" }];
              else
                queryContions = [];
              break;
          }
        } else {
          queryContions = [];
        }

        break;
      default:
        break;
    }
    return queryContions.filter(option => option.value).map(option => {
      return {
        field: option.field,
        compare: option.compare,
        value: option.value,
        andOr: option.andOr
      }
    });

  }


}
