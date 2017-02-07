angular.module('starter.controllers', []).controller('CheckinCtrl', function($scope, Chats, $window, $state, $rootScope) {
    $scope.formData = {};
    console.log(":dsfsadfdsaf")
    var url = "data/data.json"
    Chats.getServiceData(url).then(function(data){
        if(data){
          $scope.serviceData = data.data;
          localStorage.setItem("serviceData", JSON.stringify($scope.serviceData));
          $scope.productData = $window._.uniq($scope.serviceData, function(item, key, Product) { 
              return item.Product;
          });
          $scope.formData.product = $scope.productData[0];
          $scope.productChange();
        }
    });
    
    $scope.enrollemntOutcomeChange = function(){
        $scope.enrollementReferralUnique = [];
        var enrollementReferral = $window._.where($scope.serviceData, {Product : $scope.formData.product.Product, "Enrollment Outcome Recived" : $scope.formData.product["Enrollment Outcome Recived"]})
        var enrollementReferralUniq = $window._.uniq(enrollementReferral, function(item, key) { 
            return item["Enrollment Referral Source"];
        });
        angular.forEach(enrollementReferralUniq, function(data){
          $scope.enrollementReferralUnique.push({
              Product : data.Product,
              Enrollment_Outcome_Recived : data["Enrollment Outcome Recived"],
              Enrollment_Referral_Source : data["Enrollment Referral Source"]
          })
        })
        $scope.formData.referral = $scope.enrollementReferralUnique[0];
    }

    $scope.productChange = function(){
        $scope.enrollementOutcomeUnique = [];
        var enrollementOutcome = $window._.where($scope.serviceData, {Product : $scope.formData.product.Product})
        var enrollementOutcomeUnique = $window._.uniq(enrollementOutcome, function(item, key) { 
              return item["Enrollment Outcome Recived"];
          });
        angular.forEach(enrollementOutcomeUnique, function(data){
          $scope.enrollementOutcomeUnique.push({
              Product : data.Product,
              Enrollment_Outcome_Recived : data["Enrollment Outcome Recived"]
          })
        })
        $scope.formData.outcome = $scope.enrollementOutcomeUnique[0];
        $scope.enrollemntOutcomeChange();
    }
    $scope.submit = function() {
      if($scope.formData.product) {
        localStorage.setItem("FilteredData" , JSON.stringify({'product':$scope.formData.product.Product , "Enrollment_Outcome_Recived": $scope.formData.outcome.Enrollment_Outcome_Recived , "Enrollment_Referral_Source" : $scope.formData.referral.Enrollment_Referral_Source}))
        $state.go('eventmenu.attendees',{'product':$scope.formData.product.Product , "Enrollment_Outcome_Recived": $scope.formData.outcome.Enrollment_Outcome_Recived , "Enrollment_Referral_Source" : $scope.formData.referral.Enrollment_Referral_Source});
        $scope.formData = {"product" : $scope.productData[0] , "referral" : $scope.enrollementReferralUnique[0] , "outcome" : $scope.enrollementOutcomeUnique[0]};
        return;
      }
    };

    $scope.remainders = [{'id' : 0 , 'value' : 'Daily'} , {'id' : 1 , 'value' : 'Weekly'} , {'id' : 2 , 'value' : 'Monthly'}];

  })

  .controller('AttendeesCtrl', function($scope, $state, $window, $ionicSlideBoxDelegate, $rootScope) {
    // Called to navigate to the main app
    //if($state.params.slideNo){
      
    //}
    console.log($state.params);
    $scope.productData = $window._.where(JSON.parse(localStorage.getItem("serviceData")),{'Product' : $state.params.product, 'Enrollment Referral Source' : $state.params.Enrollment_Referral_Source , 'Enrollment Outcome Recived' : $state.params.Enrollment_Outcome_Recived});
    $scope.completeEnrollmentStatus =  $window._.where($scope.productData,{"Enrollment Status Received" : "Complete"});
    $scope.pendingEnrollmentStatus =  $window._.where($scope.productData,{"Enrollment Status Received" : "Pending"});
    $scope.terminatedEnrollmentStatus =  $window._.where($scope.productData,{"Enrollment Status Received" : "Terminated"});
    $scope.receivedEnrollmentStatus =  $window._.where($scope.productData,{"Enrollment Status Received" : "Received"});
    $scope.hospitals = $window._.uniq($scope.productData, function(item, key) { 
        return item["Treating Site Name"];
    });
    $scope.EnrollmentStatus = {
      chart: {
          caption: "Enrollment Status",
          showvalues: "0",
          theme: "ocean"
      },
      data:[{
          label: "Complete",
          value: $scope.completeEnrollmentStatus.length
      },
      {
          label: "Pending",
          value: $scope.pendingEnrollmentStatus.length
      },
      {
          label: "Received",
          value: $scope.receivedEnrollmentStatus.length
      },
      {
          label: "Terminated",
          value: $scope.terminatedEnrollmentStatus.length
      }]
    };
    var TopTreatingSites = [];
    angular.forEach($scope.hospitals , function(data){
      TopTreatingSites.push({
          'label' : data["Treating Site Name"],
          'value' : ($window._.where($scope.productData,{"Treating Site Name" : data["Treating Site Name"]})).length
      })
    })
    $scope.TopTreatingSites = {
      chart: {
          caption: "Top Treating Sites",
          theme: "ocean"
      },
      data:TopTreatingSites
    };;
    $scope.EnrollementOutcome = {
      chart: {
          caption: "Enrollement Outcome",
          startingangle: "120",
          showlabels: "0",
          showlegend: "1",
          showpercentvalues: "0",
          theme: "fint"
      },
      data: [
        {
            label: "Complete",
            value: $window._.where($scope.productData,{"Enrollment Outcome Recived" : "Complete"}).length
        },
        {
            label: "Pending",
            value: $window._.where($scope.productData,{"Enrollment Outcome Recived" : "Pending"}).length
        },
        {
            label: "Received",
            value: $window._.where($scope.productData,{"Enrollment Outcome Recived" : "Received"}).length
        },
        {
            label: "Terminated",
            value: $window._.where($scope.productData,{"Enrollment Outcome Recived" : "Terminated"}).length
        }
      ]
    }
    $scope.attrs = {
    "caption": "Refferal Source",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categories = [
    {
        "category": [
            {
                "label": "Physician"
            },
            {
                "label": "Pharmacy"
            },
            {
                "label": "Other"
            }
        ]
    }
];
$scope.dataset = [
    {
        
        "data": [
            {
                "value": $window._.where($scope.productData,{"Enrollment Referral Source" : "Physician"}).length
            },
            {
                "value": $window._.where($scope.productData,{"Enrollment Referral Source" : "Pharmacy"}).length
            },
            {
                "value": $window._.where($scope.productData,{"Enrollment Referral Source" : "Other"}).length
            },
            
        ]
    }
  ];
  $scope.serviceName = $window._.uniq($scope.productData, function(item, key) { 
        return item["Service Name"];
    });

  var serviceIssues = [];
    angular.forEach($scope.serviceName , function(data){
      serviceIssues.push({
          'label' : data["Service Name"],
          'value' : ($window._.where($scope.productData,{"Service Name" : data["Service Name"]})).length
      })
    })
  $scope.myDataSource = {
    "chart": {
        "caption": "Serivce Issues",
        "palette": "2",
        "rotatevalues": "0",
        "showlegend": "1",
        "valuefontcolor": "043c62",
        "valuefontbold": "1",
        "placevaluesinside": "0",
        "animation": "1",
        "plotspacepercent": "0",
        "palettecolors": "#b2d9f9,#f7c018,#94bf13,#ff9049,#069191,#d74a4a,#914b91,#5c882b,#0c93d8",
        "theme": "zune"
    },
    "data": serviceIssues
};

    $scope.startApp = function() {
      $state.go('main');
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
      console.log(index);
      $rootScope.$emit("slideHighlight", {"index" : $scope.slideIndex} );

    };
    $scope.activity = [];
    $scope.arrivedChange = function(attendee) {
      var msg = attendee.firstname + ' ' + attendee.lastname;
      msg += (!attendee.arrived ? ' has arrived, ' : ' just left, ');
      msg += new Date().getMilliseconds();
      $scope.activity.push(msg);
      if($scope.activity.length > 3) {
        $scope.activity.splice(0, 1);
      }
    };
    $rootScope.$on("gotoSlide", function(event, index){
      console.log(index);
      $ionicSlideBoxDelegate.slide(index.index);
    })
    $rootScope.$emit("indexzero");
    
  })
.directive('chartDiv', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
          $timeout(function() { scope.chartheight = (element[0].clientHeight - 6) } );
        }
    };
  })
