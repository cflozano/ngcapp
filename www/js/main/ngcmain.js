(function() {
	var ngcmain = angular.module("ngcMain", ["ui.router"]);

	ngcmain.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('index',{
			url:'/index',
			views: {
				'ngccontent':{
					templateUrl: 'templates/register.html',
					controller: 'UserCtrl'
				},
				'ngcfooter':{
					templateUrl: 'templates/ngcfooter.html'
				}
			}
		})
		.state('testapi',{
			url:'/testapi',
			views: {
				'ngccontent':{
					templateUrl: 'templates/testapi.html',
					controller: 'TestCtrl'
				},
				'ngcfooter':{
					templateUrl: 'templates/ngcfooter.html'
				}
			}
		});

		$urlRouterProvider.otherwise('/index');
	}]);
})();
