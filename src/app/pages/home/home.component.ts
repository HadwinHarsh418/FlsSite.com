import { Component } from '@angular/core';
import { Users } from 'src/app/models/users';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserService } from 'src/app/services/user.service';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Response } from 'src/app/models/response';
import { ConfirmationService, MessageService } from 'primeng/api';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})


export class HomeComponent {
  user: Users
  chart: any;
  loading: boolean;
  shortCuts: any = [];
  hideDelBtn: Boolean;

  constructor(
    private dtMgmtService: DataManagementService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

  ) {
    this.user = this.userService.tokenKey.user;
    // this.getAllColumns();
  }
  // getAllColumns() {
  //   this.dtMgmtService.getAllColumns(this.user.userId).subscribe((res) => {
  //     if (res.statusCode == 200) {
  //       let movies = res['data']['unSelectedCols'];
  //     }
  //   })
  // }
  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('main-sidebar-hide');
    this.getAllShorts();

  }
  ngAfterViewInit() {
    this.chart = am4core.create("chartdiv", am4charts.XYChart);

    this.chart.data = [{
      "year": "2016",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 0.3,
      "meast": 0.2,
      "africa": 0.1
    }, {
      "year": "2017",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }, {
      "year": "2018",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    },
    {
      "year": "2019",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    },
    {
      "year": "2020",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    },
    {
      "year": "2021",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    },
    {
      "year": "2022",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }];


    this.chart.legend = new am4charts.Legend();
    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;
    this.createSeries("europe", "Europe");
    this.createSeries("namerica", "North America");
    this.createSeries("asia", "Asia-Pacific");
    this.createSeries("lamerica", "Latin America");
    this.createSeries("meast", "Middle-East");
    this.createSeries("africa", "Africa");
  }


  createSeries(field, name) {

    // Set up series
    var series = this.chart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "year";
    series.sequencedInterpolation = true;

    // Make it stacked
    series.stacked = true;

    // Configure columns
    series.columns.template.width = am4core.percent(60);
    series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

    // Add label
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueY}";
    labelBullet.locationY = 0.5;
    labelBullet.label.hideOversized = true;

    return series;

  }

  getAllShorts() {
    this.loading = true;
    this.dtMgmtService.getAllshortcut().subscribe((res: Response) => {
      if (res.statusCode == 200) {
        this.shortCuts = res.data;
        this.loading = false;
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
      }
    })

  }

  // deleteRow(ob) {
  //   this.loading = true;
  //   this.dtMgmtService.deleteShortCut(ob.id).subscribe((res: Response) => {
  //     if (res.statusCode == 200) {
  //       this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
  //       this.getAllShorts();
  //       this.loading = false;
  //     }
  //     else {
  //       this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Oops seomthing went wrong', life: 3000 });
  //     }
  //   })

  // }


  deleteRow(shotcut) {
    const nameCapitalized = shotcut.shortcutName.charAt(0).toUpperCase() + shotcut.shortcutName.slice(1);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete shortcut for <b>' + nameCapitalized + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.dtMgmtService.deleteShortCut(shotcut.id).subscribe((res) => {
          if (res.statusCode == 200) {
            this.getAllShorts();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
          }
          else {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: res.message, life: 3000 });
          }
        })

      }
    });
  }
  ngDestroy() {
    this.chart.dispose();
  }  // Legend
}
