import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {IexapiService} from '../iexapi.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  private sym = ['FB', 'AAPL', 'AMZN', 'NFLX', 'GOOG'];
  private tableData : any;
  private tableData1 : any;
  private label : string;
  private showView : Boolean = false;
  public lineBigDashboardChartType;
  public gradientStroke;
  public chartColor;
  public canvas : any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartData:Array<any>=[];
  public lineBigDashboardChartOptions:any;
  public lineBigDashboardChartLabels: any=[];
  public lineBigDashboardChartColors:Array<any>;

  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;
  public colorLineChart : Array<any> = ['#00FFFF', '#FF00FF', '#FF0000', '#00FF00', '#FFFF00']; 

  constructor(
    private service:IexapiService,
    private titleService:Title
    ) { }

  ngOnInit() {
    this.titleService.setTitle('Compare Stocks');

    this.onSubmit();
  }

  onSubmit(){
    const filteredArray = this.sym.filter(f => f !== null && f.length !== 0) ;
    //console.log(filteredArray);
    const symbols = filteredArray.join(',');
    this.service.get_multi_prev(symbols).subscribe(data => {
    //  console.log(data);
      this.tableData = data;
      this.label = data[0].label;
    });
    this.service.get_multi_stats(symbols).subscribe(data => {
     // console.log(data);
      this.tableData1 = data;
    });
    this.showView = true;
  }

  onClick(range="1w"){
    this.showView=false;
    const filteredArray = this.sym.filter(f => f !== null && f.length !== 0) ;
   // console.log(filteredArray);
    const symbols = filteredArray.join(',');
    this.lineBigDashboardChartData = [];
    this.lineBigDashboardChartLabels = [];
    this.service.get_multi_chart(symbols, range).subscribe(data => {
      for (var i=0; i<filteredArray.length; i++){
        var tempData = [];
        var cumulativeFreq : number=0;
        //console.log(data);
        for (const d of data[i]){
          if (d['changeOverTime'] !== null){
            cumulativeFreq += parseFloat(d['changeOverTime']);
          }
          tempData.push(cumulativeFreq.toFixed(8));
        }
        this.lineBigDashboardChartData.push(
          {
              label: filteredArray[i],
              
              pointBorderWidth: 1,
              pointHoverRadius: 7,
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              fill: true,
              borderColor: this.colorLineChart[i],
              borderWidth: 2,
              data : tempData
           }
        );
      }
      for (const d of data[0]){
        this.lineBigDashboardChartLabels.push(d['label']);
      }
    });
    
    //console.log(this.chartData[0]);
    this.graph();
    

  }
  public className(value: number): string{
    if (value >= 0)
    {
      return "green";
    }
    return "red";
  }

  ngAfterViewInit(){
    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("bigDashboardChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

  }

  public graph(){
/*
    this.lineBigDashboardChartColors = [
       {
         backgroundColor: this.gradientFill,
         borderColor: this.chartColor, 
         pointBorderColor: "000000",
         pointBackgroundColor: "#2c2c2c",
         pointHoverBackgroundColor: "#2c2c2c",
         pointHoverBorderColor: this.chartColor,
       },

     ];*/
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
              position: "top",
              fillStyle: "#FFF",

              display: true
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

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }


}
