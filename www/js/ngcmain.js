(function() {
	var ngcmain = angular.module("ngcmain", []);

	ngcmain.config(["$stateProvider", "$locationProvider", function($stateProvider, $locationProvider) {
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
		$stateProvider
		.state('index',{
			url:'/',
			views: {
				'ngccontent':{
					templateUrl: 'templates/register.html',
					controller: 'UserCtrl'
				},
				'ngcfooter':{
					templateUrl: 'templates/ngcfooter.html',
					controller: 'NGCApi'	
				}
			}
		})
		.state('testapi',{
			url:'/testapi',
			views: {
				'ngccontent':{
					templateUrl: 'templates/testapi.html',
					controller: 'UserCtrl'
				},
				'ngcfooter':{
					templateUrl: 'templates/ngcfooter.html',
					controller: 'NGCApi'	
				}
			}
		})
	}])
})();
