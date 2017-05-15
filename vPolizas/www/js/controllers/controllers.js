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
  var vehiculo = {
    v1:{id: 1, marca: 'Ford', tipo: 'Mustang'},
    v2:{id: 2, marca: 'Chevrolet', tipo: 'Chevy'},
    v3:{id: 3, marca: 'Jeep', tipo: 'Jeep'},
  }

  $scope.data = '';
  $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        console.log("barcodeData simple");
        console.log(barcodeData);
        try {
            var tokenPayload = jwtHelper.decodeToken(barcodeData.text);
            console.log(barcodeData.text);
            $scope.token = barcodeData.text;
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
      const cer = "-----BEGIN CERTIFICATE-----\n" +
      "MIICaTCCAdICCQCpL2/xNIoNyDANBgkqhkiG9w0BAQUFADB5MQswCQYDVQQGEwJN\n" +
      "WDESMBAGA1UECBMJQ2hpaHVhaHVhMRIwEAYDVQQHEwlDaGlodWFodWExITAfBgNV\n" +
      "BAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEfMB0GA1UEAxMWQ29udHJpYnV5\n" +
      "ZW50ZSBGYW50YXNtYTAeFw0wOTEwMDcyMzM2MjhaFw0wOTExMDYyMzM2MjhaMHkx\n" +
      "CzAJBgNVBAYTAk1YMRIwEAYDVQQIEwlDaGlodWFodWExEjAQBgNVBAcTCUNoaWh1\n" +
      "YWh1YTEhMB8GA1UEChMYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMR8wHQYDVQQD\n" +
      "ExZDb250cmlidXllbnRlIEZhbnRhc21hMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCB\n" +
      "iQKBgQC64Mge0lWAMNnTywUJmdDBbkUcmGHVhjjRG97XESVOpYtCyk5m3rVCY603\n" +
      "Ccwsa2NoDfgRe9SJqE6IHBbXJt2BwQKxPfkkfVUNMhH0OLnllnSKIp5t0vGZzeiS\n" +
      "OuyZnrNEOMaXkAJNdsQwfjJvC+OVy3Y+8dh/Hai0tLbRsc6WBwIDAQABMA0GCSqG\n" +
      "SIb3DQEBBQUAA4GBACognXRpQ5N3HTYfSqVfeOsCbLTOXYjouGUyZW1yKXQ1kJLM\n" +
      "2ZhLS1EeuvAsCvBmW4hlOYBaIn92DAEpKTSTjsJQX1Y7cgI5QeWXW9U8qUq627id\n" +
      "fxYNt1yiUV2Apdm0gHuJOfRyF+c/sDTQv16QfjqF1zsjdjbD1Hw0Lu5zFrpt\n" +
      "-----END CERTIFICATE-----\n";
      const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxMjMsImMiOjEwMDAwMDAyMDE1MDMyNDMsImUiOjE0OTQ2NTUyMDAsInAiOiIxMjM0NTY3ODkiLCJpIjoiQiIsIml2IjoxNDk0NzQxNjAwLCJmdiI6MTUyNjE5MTIwMCwidiI6eyJzIjoiMzIxNDU2OTg3NDEiLCJmIjoxLCJ0IjoxLCJtIjoyMDE1LCJyIjoiUGFydGljdWxhciJ9fQ.b1N7pBhBtTcEYIbhBSTeqddw673rCvtAWZqIAn-DNp0NE-r4DAl-hCCYgvPlSUZZumvynx1s0FApo2W_1qU9WAN3g6oLF8buHCF_8wR67P-2vgHf8Ave-eSEp-1LNBSMzIgxUb2ReQMHMxh3WBOG4YA1bzjDahpTI34eZK4KYz0";

      try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.43.111:22000"));
        const MyContract =  web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"polizas","outputs":[{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"idAseguradora","type":"uint8"},{"name":"addr","type":"address"}],"name":"registraAseguradora","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"noPoliza","type":"bytes32"},{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"name":"endosaPoliza","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"aseguradoras","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"noPoliza","type":"bytes32"},{"name":"inicioVigencia","type":"uint256"},{"name":"finVigencia","type":"uint256"}],"name":"registraPoliza","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]);
        const contractInstance = MyContract.at('0x3950943d8d86267c04a4bba804f9f0b8a01c2fb8');
        const addrAseguradora = contractInstance.aseguradoras(1);
        console.log(addrAseguradora);
        console.log(contractInstance.polizas(addrAseguradora, p + '-' + i));
        const validez = contractInstance.polizas(addrAseguradora, p + '-' + i)
        try {
          var isValid = KJUR.jws.JWS.verify($scope.token, cer, ["RS256"]);
          //var isValid = KJUR.jws.JWS.verify("Certicate Valid", cer, ["RS256"]);
          if(isValid === true){
            var estado = 'La poliza se encuentra dentro de la vigencia'
          }else{
            var estado = 'La poliza no se encuentra dentro de la vigencia'
          }
        } catch (e) {
          $scope.showAlert(e);
        }
        $scope.openModalValidez(validez, estado, isValid);
      }
      catch(err) {
          $scope.showAlert("Error al validar la poliza, intentalo de nuevo" + err);
      }

    }




     $scope.showValidateCer = function(isValid) {
       if(isValid === true){
         var alertPopup = $ionicPopup.alert({
           title: 'Estado de la poliza',
           template:'La poliza se encuentra dentro de la vigencia'
         });
       }else{
         var alertPopup = $ionicPopup.alert({
           title: 'Estado de la poliza',
           template:'La poliza no se encuentra dentro de la vigencia'
         });
       }
        alertPopup.then(function(res) {
          console.log('Error al escanear el QR');
        });
      };



     $ionicModal.fromTemplateUrl('templates/modalValidate.html', {
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.modal = modal;
       $scope.validateCer = function(){
       }
     });
     $scope.openModalValidez = function(val, estado, valid) {
       $scope.modal.show();
       $scope.validez = val;
       $scope.estado = estado;
       $scope.isValid = valid;
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