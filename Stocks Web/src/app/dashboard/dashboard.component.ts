import { Component, OnInit } from '@angular/core';
import { IexapiService } from '../iexapi.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public lineBigDashboardChartType;
  public gradientStroke;
  public chartColor;
  public canvas : any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartData:Array<any>;
  public lineBigDashboardChartOptions:any;
  public lineBigDashboardChartLabels: any=[];
  public lineBigDashboardChartColors:Array<any>;

  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;


  public bigdata: any=[];
  public items: any=[];
  public selectedCompany = 'AAPL';
  public message: string;
  public companyData: any={};
  public logoUrl: string;
  public ohlcData: any={};

  public getSelectedCompany(){

    this.service.getdata(this.selectedCompany).subscribe(data => {
      this.bigdata = [];
      this.lineBigDashboardChartLabels = [];
      for (const d of (data as any)) {
        this.bigdata.push(d.average);
        this.lineBigDashboardChartLabels.push(d.label);
      }
      this.graph();
      this.message = data[0]['date'];
    });

    this.service.get_real(this.selectedCompany).subscribe(data =>{
      this.companyData = data;
    });

    this.service.get_logo_url(this.selectedCompany).subscribe(data =>{
      this.logoUrl = data['url'];
      console.log(this.logoUrl);
    });

    this.service.get_ohlc(this.selectedCompany).subscribe(data =>{
      this.ohlcData = data;
    });
    
  }

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
  // public hexToRGB(hex, alpha) {
  //   var r = parseInt(hex.slice(1, 3), 16),
  //     g = parseInt(hex.slice(3, 5), 16),
  //     b = parseInt(hex.slice(5, 7), 16);

  //   if (alpha) {
  //     return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  //   } else {
  //     return "rgb(" + r + ", " + g + ", " + b + ")";
  //   }
  // }
  constructor(
    private service:IexapiService,
    private titleService:Title
    ) { }
  
  public onClick(value: any, message: any){
    this.service.get_data_time(value ,this.selectedCompany).subscribe(data => {
      this.bigdata = [];
      
      this.lineBigDashboardChartLabels = [];
      for (const d of (data as any)) {
        this.bigdata.push(d.close);
        this.lineBigDashboardChartLabels.push(d.label);
      }
      this.graph();
      this.message = message;
    });
  }

  ngOnInit() {
    this.titleService.setTitle("Dashboard");
    this.getSelectedCompany();
    
  }

  public graph(){
    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("bigDashboardChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.lineBigDashboardChartData = [
        {
          label: 'Data',

          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          fill: true,

          borderWidth: 2,
          data : this.bigdata 
        }
      ];
      this.lineBigDashboardChartColors = [
       {
         backgroundColor: this.gradientFill,
         borderColor: this.chartColor,
         pointBorderColor: this.chartColor,
         pointBackgroundColor: "#2c2c2c",
         pointHoverBackgroundColor: "#2c2c2c",
         pointHoverBorderColor: this.chartColor,
       }
     ];
    this.lineBigDashboardChartOptions = {

          layout: {
              padding: {
                  left: 20,
                  right: 20,
                  top: 0,
                  bottom: 0
              }
          },
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: '#fff',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          legend: {
              position: "bottom",
              fillStyle: "#FFF",
              display: false
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(255,255,255,0.4)",
                      fontStyle: "bold",
                      beginAtZero: false,
                      maxTicksLimit: 5,
                      padding: 10
                  },
                  gridLines: {
                      drawTicks: true,
                      drawBorder: false,
                      display: true,
                      color: "rgba(255,255,255,0.1)",
                      zeroLineColor: "transparent"
                  }

              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent",
                      display: false,

                  },
                  ticks: {
                      padding: 10,
                      fontColor: "rgba(255,255,255,0.4)",
                      fontStyle: "bold"
                  }
              }]
          }
    };

    this.lineBigDashboardChartType = 'line';

	}
}
