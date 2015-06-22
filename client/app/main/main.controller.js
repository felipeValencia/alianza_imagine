'use strict';

angular.module('alianzaImagineApp')
  .controller('MainCtrl', function ($scope, $http, ngAudio,$modal,$log) {
 
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
                  '¡Ya casi esta lista tu imagen de ReConexión! Presiona la tuerca para iniciar la ReConstrucción'];


    var currentPaso=0;
    var slide = ngAudio.load('../../assets/sounds/slide.mp3'); // returns NgAudioObject
    var sound = ngAudio.load('../../assets/sounds/begin.mp3'); // returns NgAudioObject

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
      sound.play();
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

   $scope.open_dialog = function (texto,ico) {     
      var modalDialog = $modal.open({
        animation: true,
        templateUrl: 'modal_dialog.html',
        controller: 'ModalDialogCtrl',
        windowClass: 'mi_modal_dialog',          
        resolve: {
          datos: function () {
            return {'texto':texto,'ico':ico};
          }
        }
      });

      modalDialog.result.then(function () {
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

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('alianzaImagineApp').controller('ModalDialogCtrl', function ($scope, $modalInstance, datos) {

  $scope.message = datos.texto;
  $scope.ico = datos.ico;

  $scope.ok = function () {
    $modalInstance.close();
  };

});