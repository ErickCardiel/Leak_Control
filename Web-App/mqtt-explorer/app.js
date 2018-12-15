var meditions = 
{
   pulses:0,
   time:0
};
var chart;
var mqttClient;
const publishTopic = "$aws/things/Ultimo/pipeState";



function confirmChange(opc){
   if(opc==1){
      $('#myModalOpenValve').modal('show');
   }
   else{
      $('#myModalCloseValve').modal('show');
   }
}


function openPipe(){
   mqttClient.publish(publishTopic, "{\"state\":{\"reported\":{\"closePipe\" : 0}}}");
}

function closePipe(){
   mqttClient.publish(publishTopic, "{\"state\":{\"reported\":{\"closePipe\" : 1}}}");
}

function updateDataPoint()
{
   var length = chart.options.data[0].dataPoints.length;
   chart.options.title.text = "Leak Control";

   var tmpData = [
   {
      type: "spline",
      dataPoints: [{label: meditions.time, y: meditions.pulses }]
   }
   ];

   chart.options.data[0].dataPoints[length-1].y = meditions.pulses;
   chart.options.data[0].dataPoints[length-1].label = meditions.time;

   chart.render();
}

function AddNewPoint()
{
   var length = chart.options.data[0].dataPoints.length;
   chart.options.title.text = "Leak Control";

    var tmpData = [
   {
      type: "spline",
      dataPoints: [{label: meditions.time,  y: meditions.pulses}]
   }
   ];

   chart.options.data[0].dataPoints.push(tmpData);
   updateDataPoint();
   chart.render();
}


window.onload = function () {
   chart = new CanvasJS.Chart("chartContainer", { 
      title: {
         text: "Leak Control"
      },
      data: [
      {
         type: "spline",
         dataPoints: [
         ]
      }
      ]
   });
   chart.render();   
}