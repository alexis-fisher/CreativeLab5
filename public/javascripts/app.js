var app = window.angular.module('app', [])

app.factory('pokemonFetcher', pokemonFetcher)
app.controller('mainCtrl', mainCtrl)

function pokemonFetcher ($http) {

  var API_ROOT = 'pokemon'
  return {
    get: function () {
      return $http
        .get(API_ROOT)
        .then(function (resp) {
          return resp.data
        })
    },
    post: function (formData) {
      return $http
         .post(API_ROOT,formData)
         .then(function (resp) {
           console.log("Post worked");
         })
    } 
  }
}

function mainCtrl ($scope,$http, pokemonFetcher) {

  $scope.pokemon = []

  pokemonFetcher.get()
    .then(function (data) {
      $scope.pokemon = data
    })
  $scope.addPoki = function() {
    if($scope.Name === '') {return;}
    if($scope.Url === '') {return;}
    var formData = {name:$scope.Name,avatarUrl:$scope.Url};
    console.log(formData);
    pokemonFetcher.post(formData); // Send the data to the back end
    $scope.create({
      name: $scope.Name,
      avatarUrl:$scope.Url,
      upvotes: 0,
    });
    $scope.Name = '';
    $scope.Url = '';
  }
  $scope.create = function(p) {
    return $http.post('/pokemon',p).success(function(data){
      $scope.pokemon.push(data);
    });
  };
  $scope.upvote = function(p) {
      return $http.put('/pokemon/' + p._id + '/upvote')
      .success(function(data){
        console.log("upvote worked");
        p.upvotes +=1;
       });
   };
  $scope.incrementUpvotes = function(p) {
    $scope.upvote(p);
  };
  $scope.downvote = function (p) {
    return $http.put('/pokemon/' + p._id + '/upvote')
    .success(function (data) {
      console.log("downvote worked");
      p.upvotes -= 1;
    });
  };
  $scope.decrementUpvotes = function(p) {
    $scope.downvote(p);
  };
  
  $scope.delete = function(p) {
       $http.delete('/pokemon/' + p._id )
       .success(function(data){
           console.log("delete worked");
        });
        $scope.getAll();
  };
  $scope.getAll = function() {
       return $http.get('/pokemon').success(function(data){
         angular.copy(data, $scope.pokemon);
       });
  };
  $scope.getAll();
}

