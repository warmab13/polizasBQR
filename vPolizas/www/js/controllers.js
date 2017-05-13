angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ScannerCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup, jwtHelper, $ionicModal) {


  $scope.data = '';
  $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        console.log("barcodeData simple");
        console.log(barcodeData);
        try {
            var tokenPayload = jwtHelper.decodeToken(barcodeData.text);
            $scope.data = tokenPayload;
        }
        catch(err) {
            $scope.showAlert("Error al escanear el QR, por favor vuelvelo a escanear");
        }

      }, function(error) {
        $scope.showAlert("Error al escanear el QR, por favor vuelvelo a escanear");
      });
    };

    $scope.validatePo = function(a, p, i){
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.43.111:22000"));
        const MyContract =  web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"polizas","outputs":[{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"idAseguradora","type":"uint8"},{"name":"addr","type":"address"}],"name":"registraAseguradora","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"noPoliza","type":"bytes32"},{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"name":"endosaPoliza","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"aseguradoras","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"noPoliza","type":"bytes32"},{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"name":"registraPoliza","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]);
        const contractInstance = MyContract.at('0x3950943d8d86267c04a4bba804f9f0b8a01c2fb8');
        const addrAseguradora = contractInstance.aseguradoras(1);
        console.log(addrAseguradora);
        console.log(contractInstance.polizas(addrAseguradora, p + '-' + i));
        const validez = contractInstance.polizas(addrAseguradora, p + '-' + i)
        $scope.openModalValidez(validez);
      }
      catch(err) {
          $scope.showAlert("Error al validar la poliza, intentalo de nuevo" + err);
      }

    }

    $scope.showAlert = function(error) {
       var alertPopup = $ionicPopup.alert({
         title: 'Error',
         template: error
       });

       alertPopup.then(function(res) {
         console.log('Error al escanear el QR');
       });
     };


     $ionicModal.fromTemplateUrl('templates/modalValidate.html', {
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.modal = modal;
     });
     $scope.openModalValidez = function(val) {
       $scope.modal.show();
       $scope.validez = val;
     };
     $scope.closeModalValidez = function() {
       $scope.modal.hide();
     };
     // Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function() {
       $scope.modal.remove();
     });
     // Execute action on hide modal
     $scope.$on('modal.hidden', function() {
       // Execute action
     });
     // Execute action on remove modal
     $scope.$on('modal.removed', function() {
       // Execute action
     });


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
