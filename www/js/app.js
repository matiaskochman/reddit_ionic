(function(){
	"use strict";

var app= angular.module('myreddit', ['ionic','angularMoment']);

app.controller('RedditCtrl',function($http,$scope){
	$scope.stories = [];
	
	
	$scope.watingResponse = false;
	
	function loadStories(params,callback){
		
		var storiesArray = [];
			$http.get('http://www.reddit.com/r/funny/new/.json',{params:params}).success(function(response) {
				angular.forEach(response.data.children,function(child){
					//console.log(child.data);
					
					var story = child.data;
					if(!story.thumbnail || story.thumbnail === 'self' 
						|| story.thumbnail.indexOf('http')!== 0){
						story.thumbnail = 'http://www.redditstatic.com/icon.png';
					}
					storiesArray.push(child.data);
					
				});
				callback(storiesArray);
			});
			
	}
	
	$scope.loadOlderStories = function() {
		
		if($scope.waitingResponse !== true ){
			
			$scope.watingResponse = true;
			
			var params = {};
			
			if($scope.stories.length > 0 ){
				params.after = $scope.stories[$scope.stories.length -1].name;
			}
			
			loadStories(params,function(oldStories){
				$scope.stories = $scope.stories.concat(oldStories);
				$scope.watingResponse = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
		}
		
	};	
	
	
	$scope.loadNewerStories = function() {
		if($scope.waitingResponse !== true ){
			
			$scope.watingResponse = true;
			var params = {};
			
			params.before = $scope.stories[0].name;
			
			loadStories(params,function(newStories){
				$scope.stories = newStories.concat($scope.stories);
				$scope.watingResponse = false;
				console.log(newStories);
				$scope.$broadcast('scroll.refreshComplete');
			});
			
		}
		
		
	};
	
	$scope.openLink = function(url){
		window.open(url, '_blank');
	}
	
});

	app.run(function($ionicPlatform) {
	  $ionicPlatform.ready(function() {
	    if(window.cordova && window.cordova.plugins.Keyboard) {
	      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	      // for form inputs)
	      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	
	      // Don't remove this line unless you know what you are doing. It stops the viewport
	      // from snapping when text inputs are focused. Ionic handles this internally for
	      // a much nicer keyboard experience.
	      cordova.plugins.Keyboard.disableScroll(true);
	    }
	    if(window.cordova && window.cordova.InAppBrowser){
	    	window.cordova = window.cordova.InAppBrowser.open;
	    }
	    if(window.StatusBar) {
	      StatusBar.styleDefault();
	    }
	  });
	})
}());
