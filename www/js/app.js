// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services' , 'ng-fusioncharts' , 'ui.bootstrap'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('eventmenu', {
        url: "/event",
        templateUrl: "templates/tabs.html",
        controller : "menuController"
      })
      .state('home', {
        url: "/home",
        templateUrl: "templates/tab-dash.html"
        
      })
      .state('checkin', {
        url: "/check-in",
        templateUrl: "templates/tab-chats.html",
        controller: "CheckinCtrl"
          
      })
      .state('eventmenu.attendees', {
        url: "/attendees",
        views: {
          'menuContent' :{
            templateUrl: "templates/tab-account.html",
            controller: "AttendeesCtrl",

          }
        },
        params : {"product" : "","Enrollment_Outcome_Recived" : "","Enrollment_Referral_Source" : "","index" : 0},
        cache : false
      })

    $urlRouterProvider.otherwise("/home");
  })

  .controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.attendees = [
      { firstname: 'Nicolas', lastname: 'Cage' },
      { firstname: 'Jean-Claude', lastname: 'Van Damme' },
      { firstname: 'Keanu', lastname: 'Reeves' },
      { firstname: 'Steven', lastname: 'Seagal' }
    ];

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('menuController', function($scope, $ionicSideMenuDelegate, $state, $rootScope) {
    $scope.filterdata = JSON.parse(localStorage.getItem('FilteredData'));
    $scope.index = 0;
    $scope.goto = function(index){
        $scope.index = index;
        $rootScope.$emit("gotoSlide", {"index" : index} );
    }
    $rootScope.$on("slideHighlight", function(event, index){
      $scope.index = index.index;
    })
    $rootScope.$on("indexzero", function(event){
        
      $scope.index = 0;
    })
  });
