'use strict';

angular.module('alianzaImagineApp')
  .controller('MainCtrl', function ($scope, $http, ngAudio,$modal,$log) {
    /*$scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };*/


    /*$scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();
      if($scope.status) {
        $facebook.api('/me').then(function(user) {
          $scope.user = user;
        });
      }
    });*/
    // $facebook.login();

    this.front = false;
    this.right = false;
    this.left = false;
    this.back = false;
    this.bottom=false;
    this.make = false;
    this.step = '';
    this.banner = false;
    this.buttonNav = false;
    this.helpText = '';

    $scope.text = 'MI TEXTO';
    $scope.color = '#4C0255';
    $scope.backGround = '1.png';

   var pasos = ['left', 'front', 'bottom', 'right','back'];
   var numbers = ['icon-one', 'icon-two' , 'icon-three', 'icon-four'];
   var texts = ['!Es el momento de Reconectarnos para intensificar el mensaje de verdad! \nCrea tu propia definición de ReConexión y ayúdanos a Renovar lo establecido.',
                  'Escoge tu fondo favorito',
                  'Personaliza el color de la letra',
                  '!Ya casi esta lista tu imagen de ReConexion¡ Presiona la tuerca para iniciar la ReContruccion'];


    var currentPaso=0;
    var slide = ngAudio.load('../../assets/sounds/giro.mp3'); // returns NgAudioObject
    //var sound = ngAudio.load('../../assets/sounds/begin.mp3'); // returns NgAudioObject

    $scope.ButtonClicked = function($event,classSel) {    
     
    
      if(classSel==='left' && currentPaso!==0){
        this[pasos[currentPaso]] = false;
        this[pasos[currentPaso-1]]=true;
        currentPaso=currentPaso-1;
         slide.play();
      }

      if(classSel==='right' && currentPaso!==4){

       /* if(currentPaso+1 == 4){
          $scope.MakeCube();
        }*/

        this[pasos[currentPaso]] = false;
        this[pasos[currentPaso+1]]=true;
        currentPaso=currentPaso+1;
        slide.play();
      }

      if(currentPaso>0){
        this.step=numbers[currentPaso-1];
        this.helpText=texts[currentPaso-1];
        this.banner = true;
      }else{
        this.step='';
        this.helpText = '';
        this.banner = false;
      }

    };

    $scope.ButtonMenu = function($event,number) {    
    
        if(number!==currentPaso){

          /*if(number == 4){
            $scope.MakeCube();
          }*/

           this[pasos[currentPaso]] = false;
           this[pasos[number]]=true;
           currentPaso=number; 
           slide.play();
        }          

      if(currentPaso>0){
        this.step=numbers[currentPaso-1];
        this.helpText=texts[currentPaso-1];
        this.banner = true;
      }else{
        this.step='';
        this.helpText = '';
        this.banner = false;
      }

    };

    $scope.RegistroSelected = function($event,number) {         
        $scope.backGround=number;
    };

    $scope.inicioSound = function(){    
      //sound.play();
    };

    $scope.initialShow = function(){
      this.left = true;
     // this.backGround = '1.png';
      this.buttonNav = true;
    };

    $scope.MakeCube = function(){

      this.banner = false;
      this.buttonNav = false;
      //this.back = false;
      //this.make=true;      
      //Genero canvas
    };
 
 
  $scope.open = function () {
      $scope.datos = {'imagen':$scope.backGround,'texto':$scope.text,'color':$scope.color};
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        windowClass: 'mi_modal',    
        size:'lg',   
        resolve: {
          datos: function () {
            return $scope.datos;
          }
        }
      });

      modalInstance.result.then(function () {
        //$scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

});


angular.module('alianzaImagineApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, datos) {


  console.log(datos.imagen+' '+datos.texto+'  '+datos.color);
  console.log('Generando Canvas');
  var canvas;
  $scope.func = function(){
   var startimg='../../assets/images/backs/'+datos.imagen; 
    canvas = document.getElementById('tempCanvas');
    var context = canvas.getContext('2d');

    var source =  new Image();
    source.src = startimg;
    source.onload = function(){

      context.drawImage(source, 0, 0, 700, 700 * source.height / source.width);
      context.font = '65px myFirstFont';
     
      /*if (textWidth > canvas.offsetWidth) {
          context.font = '40px impact';
      }*/
      context.textAlign = 'left';
      context.fillStyle = datos.color;

      context.fillText(datos.texto,190,(canvas.height*0.7)+27);
      
      var canvasDiv = document.getElementById('canvasDiv');       
      canvasDiv.appendChild(canvas);
      /*if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
      }*/
      context = canvas.getContext('2d'); 
    };
  };

  /*
  $scope.postCanvasToFacebook =  function () {
      var data = canvas.toDataURL("image/png");
      var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
      var decodedPng = Base64Binary.decode(encodedPng);     
      $scope.postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
  };

  $scope.postImageToFacebook = function ( authToken, filename, mimeType, imageData, message ) {
      // this is the multipart/form-data boundary we'll use
      var boundary = '----ThisIsTheBoundary1234567890';   
      // let's encode our image file, which is contained in the var
      var formData = '--' + boundary + '\r\n'
      formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
      formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
      for ( var i = 0; i < imageData.length; ++i )
      {
          formData += String.fromCharCode( imageData[ i ] & 0xff );
      }
      formData += '\r\n';
      formData += '--' + boundary + '\r\n';
      formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
      formData += message + '\r\n'
      formData += '--' + boundary + '--\r\n';
      
      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
      xhr.onload = xhr.onerror = function() {
          console.log( xhr.responseText );
      };
      xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
      xhr.sendAsBinary( formData );
  };*/

 

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});