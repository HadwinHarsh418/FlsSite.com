import { Component, enableProdMode, OnInit, ViewChild } from '@angular/core';
import { Page } from 'src/app/models/page';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { DxChartComponent,DxDataGridComponent,DxPivotGridComponent,} from 'devextreme-angular';
import { Service } from 'src/app/services/pivot.service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataManagementService } from 'src/app/services/data-management.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-demo-grid',
  templateUrl: './demo-grid.component.html',
  styleUrls: ['./demo-grid.component.css']
})
export class DemoGridComponent  {
  
  @ViewChild(DxPivotGridComponent, { static: false })
  pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  dataSource: any;
  @ViewChild('dataGridVar') dataGrid: DxDataGridComponent;
  pivotGridDataSource: any;
  page: Page = new Page();
  customers: any;
  user: Users;

  selectAllModeVlaue = 'page';

  selectionModeValue = 'all';
  loadingShortCut: boolean;
  stCode: number = 0;
  uploadStatus: {
    totalRows: 0;
    rowsInserted: 0;
    rowsNotInserted: 0;
  };
  openExtraCol: boolean;
  summaryDisplayModes: any = [
    { text: 'None', value: 'none' },
    { text: 'Absolute Variation', value: 'absoluteVariation' },
    { text: 'Percent Variation', value: 'percentVariation' },
    { text: 'Percent of Column Total', value: 'percentOfColumnTotal' },
    { text: 'Percent of Row Total', value: 'percentOfRowTotal' },
    {
      text: 'Percent of Column Grand Total',
      value: 'percentOfColumnGrandTotal',
    },
    { text: 'Percent of Row Grand Total', value: 'percentOfRowGrandTotal' },
    { text: 'Percent of Grand Total', value: 'percentOfGrandTotal' },
  ];
  hideUploadSec: Boolean;
  actionBtn: boolean;
  hideGraph: boolean;

  startYYMM: Date;
  endYYMM: Date;
  types = [
    { id: 1, type: 'XLSX' },
    { id: 2, type: 'CSV' },
  ];
  selectedType: any = { id: 1, type: 'XLSX' };
  loadData: boolean;
  years: any = [];
  selectedYears: any = [];

  months: any = [
    { month: 1, name: 'Jan' },
    { month: 2, name: 'Feb' },
    { month: 3, name: 'Mar' },
    { month: 4, name: 'Apr' },
    { month: 5, name: 'May' },
    { month: 6, name: 'Jun' },
    { month: 7, name: 'Jul' },
    { month: 8, name: 'Aug' },
    { month: 9, name: 'Sept' },
    { month: 10, name: 'Oct' },
    { month: 11, name: 'Nov' },
    { month: 12, name: 'Dec' },
  ];
  selectedMonths: { month: number; name: string }[] = [];

  applyChangesModes: any;
  applyChangesMode: any;

  constructor(
    // remoteOperations: true,
    service: Service,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dtMmgmtService: DataManagementService
  ) {
    this.user = this.userService.tokenKey.user;

    this.loadPivotReport();
    this.getShortCutStatus();
    this.setMonthYearOnload();
    this.applyChangesModes = ['instantly', 'onDemand'];
    this.applyChangesMode = this.applyChangesModes[0];
  }
  setMonthYearOnload() {
    let currentdate = new Date();
    let dt = currentdate.getDate();
    if (dt <= 15) {
      currentdate = new Date(currentdate.setMonth(currentdate.getMonth() - 1));
    }
    this.endYYMM = currentdate;
    this.startYYMM = currentdate;

    let month = { month: currentdate.getMonth() + 1 };
    this.selectedMonths = this.months.filter((mn) => mn.month == month.month);
    this.selectedYears = [{ year: currentdate.getFullYear() }];
  }

  loadPivotReport(startDate?, endDate?, data?,loadOptions?) {
    // this.pivotGridDataSource = new PivotGridDataSource({
    //  remoteOperations: true,
    //   store: AspNetData.createStore({
      this.dataSource = {
        remoteOperations: true,
        store: AspNetData.createStore({
          key: 'OrderID',
        loadUrl: `${environment.url}PivotReports/GetSalesReportDataByDatesV2?startYYMM=${startDate}&endYYMM=${endDate}&dates=${data}&Orders=${loadOptions}`,
        onBeforeSend: async (method, ajaxOptions) => {
          let token = this.userService.tokenKey.token;
          ajaxOptions.headers = {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json; charset=utf-8',
          };
        },
      }),
      onLoadError: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: error.message,
          life: 3000,
        });
      },
      fields: [
        {
          caption: 'Regional Rep',
          width: 120,
          dataField: 'regionalRep',

          area: 'row',
          // sortBySummaryField: 'SalesAmount',
          // sortBySummaryPath: [],
          // sortOrder: 'desc',
        
        },
        {
          caption: 'Broker',
          width: 120,
          dataField: 'broker',
          area: 'row',
          // sortBySummaryField: 'SalesAmount',
          // sortBySummaryPath: [],
          // sortOrder: 'desc',
        },

        {
          caption: 'Customer',
          width: 120,
          dataField: 'customer',
          area: 'row',
          // sortBySummaryField: 'SalesAmount',
          // sortBySummaryPath: [],
          // sortOrder: 'desc',
        },
        {
          caption: 'Category',
          width: 120,
          dataField: 'category',
          area: 'row',
        },
        {
          caption: 'Item No',
          width: 120,
          dataField: 'itemNo',
          area: 'row',
        },
        {
          caption: 'Item Desc',
          width: 120,
          dataField: 'itemDesc',
          area: 'row',
        },
        {
          caption: 'Year',
          dataField: 'year',
          // dataType: 'yearMonth',
          area: 'column',
        },

        {
          caption: 'Sales',
          dataField: 'salesAmt',
          dataType: 'number',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
          format: { type: 'currency', precision: 2 },
        },
        {
          caption: 'Case Qty',
          dataField: 'caseQty',
          dataType: 'number',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
        },

        {
          caption: 'Ship City',
          width: 120,
          dataField: 'shipCity',
          area: 'row',
        
        },
        {
          caption: 'Ship State',
          width: 120,
          dataField: 'shipState',
          area: 'row',
        },
        {
          caption: 'Ship Via',
          width: 120,
          dataField: 'shipVia',
          area: 'row',
        },
        {
          caption: 'Tracking',
          width: 120,
          dataField: 'tracking',
          area: 'row',
        },
      ],
    }
      // store: service.getSales()
    // });
  }
  prepareContextMenu(e) {
    let dataSource: any = this.pivotGridDataSource;
    if (e.field !== dataSource.field(4)) return;

    for (let summaryDisplayMode of this.summaryDisplayModes) {
      var summaryDisplayModeValue = summaryDisplayMode.value;

      e.items.push({
        text: summaryDisplayMode.text,
        selected: e.field.summaryDisplayMode === summaryDisplayModeValue,
        onItemClick: function (args) {
          var format,
            caption =
              summaryDisplayModeValue === 'none'
                ? 'Total Sales'
                : 'Relative Sales';
          if (
            summaryDisplayModeValue === 'none' ||
            summaryDisplayModeValue === 'absoluteVariation'
          ) {
            format = 'currency';
          }
          dataSource.field(4, {
            summaryDisplayMode: summaryDisplayModeValue,
            format: format,
            caption: caption,
          });

          dataSource.load();
        },
      });
    }
  }

  onResetButtonClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset the grid?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pivotGridDataSource.state({});
      },
    });
  }

  citySelector(data) {
    return data.city + ' (' + data.country + ')';
  }
  selectorfilter(load) {
    return load.Customer +'(' + load.Sales +')';
  }

  ngOnInit() {
    var date = new Date();
    var currentyears = date.getFullYear();
    for (var i = 0; i <= 10; i++) {
      this.years.push({ year: currentyears - i });
    }
  }

  ngAfterViewInit() {
    this.pivotGrid.instance.bindChart(this.chart.instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });

    setTimeout(() => {
      var dataSource = this.pivotGrid.instance.getDataSource();
      // dataSource.expandHeaderItem('row', ['North America']);
      // dataSource.expandHeaderItem('column', [2013]);
    }, 0);
  }

  customizeTooltip(args) {
    return {
      html:
        args.seriesName +
        " | Total<div class='currency'>" +
        args.valueText +
        '</div>',
    };
  }

  addToshortcut() {
    const dt = {
      icon: 'sidemenu-icon ti-pulse',
      url: '/items-list/pivot-report',
      shortcutName: 'Pivot report',
    };
    this.loadingShortCut = true;
    this.dtMmgmtService.addToFav(dt).subscribe((res) => {
      if (res.statusCode == 200) {
        this.loadingShortCut = false;
        this.getShortCutStatus();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: res.message,
          life: 3000,
        });
      } else {
        this.loadingShortCut = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Oops something went wrong',
          life: 3000,
        });
      }
    });
  }

  getShortCutStatus() {
    this.dtMmgmtService.getSortcutName('Pivot report').subscribe((res) => {
      if (res.statusCode == 200) {
        this.stCode = res.data;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
      }
    });
  }

  removeDataGrid(e) {
    this.dataGrid.instance.dispose();
    document.getElementById('myDataGrid').remove();
    setTimeout(() => {
      // this.loadPivotReport();
    }, 300);
  }

  handler(event) {
    this.uploadStatus = event;
    if (this.uploadStatus) this.openExtraCol = true;
    // this.loadPivotReport();
  }

  hidewarningDialog() {
    this.openExtraCol = false;
  }

  loadReport() {
    if (!this.startYYMM) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please select start date',
        life: 3000,
      });
      return;
    }
    if (!this.endYYMM) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please select end date',
        life: 3000,
      });
      return;
    }
    let startDate = this.startYYMM
      ? `${this.startYYMM.getFullYear()}-${this.getMonth(
          this.startYYMM.getMonth() + 1
        )}`
      : null;
    let endDate = this.endYYMM
      ? `${this.endYYMM.getFullYear()}-${this.getMonth(
          this.endYYMM.getMonth() + 1
        )}`
      : null;

    if (this.startYYMM && this.endYYMM) {
      let dtBig = this.endAfterStart(startDate, endDate);
      if (!dtBig) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'End date can not be greater than start data',
          life: 3000,
        });
        return;
      } else {
        // this.loadPivotReport(startDate, endDate);
      }
    }
  }

  loadMonthReport() {
    let dates = [];
    if (!this.selectedYears.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please select atleast one Year',
        life: 3000,
      });
      return;
    }
    if (!this.selectedMonths.length) {
      this.selectedYears.forEach((yr) => {
        this.months.forEach((mn) => {
          dates.push(yr.year + '-' + this.getMonth(mn.month));
        });
      });
    } else {
      this.selectedYears.forEach((yr) => {
        this.selectedMonths.forEach((mn) => {
          dates.push(yr.year + '-' + this.getMonth(mn.month));
        });
      });
    }
    //this.loadPivotReport(null, null, JSON.stringify(dates));
  }

  dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? '0' + month : month;
        dates.push({ year: [i, displayMonth].join('-') });
      }
    }
    return dates;
  }

  getMonth(mth) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }

  endAfterStart(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    return endDate.getTime() >= startDate.getTime();
  }

  vanishFilter() {
    this.startYYMM = null;
    this.endYYMM = null;
    this.selectedYears = [];
    this.selectedMonths = [];

   // this.loadPivotReport(this.startYYMM, this.endYYMM, undefined);
  }
  onChange(event) {
    this.selectedType = event.value;
  }

  downloadCsv() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');

    link.href =
      this.selectedType.type == 'XLSX'
        ? 'assets/SalesPivotReport_Sample_XLS.xlsx'
        : 'assets/SalesPivotReport_Sample_CSV.csv';
    link.download =
      this.selectedType.type == 'XLSX'
        ? 'SalesPivotReport_Sample_XLS.xlsx'
        : 'SalesPivotReport_Sample_CSV.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  refreshRepo() {
    this.loadData = true;
    this.dtMmgmtService.getFreshSaleData().subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.stCode = res.data;
          // this.loadPivotReport(null, null, null);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: res.message,
            life: 3000,
          });
        }
        this.loadData = false;
      },
      (error) => {}
    );
    this.setMonthYearOnload();
  }

  refreshWarn() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset the table?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vanishFilter();
      },
    });
  }


  
  // contextMenuPreparing(e) {
  // const dataSource = e.component.getDataSource();
  // const sourceField = e.field;

  // if (sourceField) {
  //   if (!sourceField.groupName || sourceField.groupIndex === 0) {
  //     e.items.push({
  //       text: 'Hide field',
  //       onItemClick() {
  //         let fieldIndex;
  //         if (sourceField.groupName) {
  //           fieldIndex = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex].index;
  //         } else {
  //           fieldIndex = sourceField.index;
  //         }

  //         dataSource.field(fieldIndex, {
  //           area: null,
  //         });
  //         dataSource.load();
  //       },
  //     });
  //   }
  //   if (sourceField.dataType === 'number') {
  //     const setSummaryType = function (args) {
  //       dataSource.field(sourceField.index, {
  //         summaryType: args.itemData.value,
  //       });

  //       dataSource.load();
  //     };
  //     const menuItems = [];

  //     e.items.push({ text: 'Summary Type', items: menuItems });

  //     for (const summaryType of ['Sum', 'Avg', 'Min', 'Max']) {
  //       const summaryTypeValue = summaryType.toLowerCase();

  //       menuItems.push({
  //         text: summaryType,
  //         value: summaryType.toLowerCase(),
  //         onItemClick: setSummaryType,
  //         selected: e.field.summaryType === summaryTypeValue,
  //       });
  //     }
    // this.loadPivotReport( JSON.stringify(loadOptions));
//     }

//   }
// }
}
