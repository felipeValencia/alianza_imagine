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

    $scope.fill_vars = function(token,id){
      $scope.token = token;
      $scope.id = id;
    };
 
 
  $scope.open = function () {
      $scope.datos = {'imagen':$scope.backGround,'texto':$scope.text,'color':$scope.color};
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        windowClass: 'mi_modal',    
        size:'lg',   
        scope: $scope,
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


angular.module('alianzaImagineApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, $modal, datos) {


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


  $scope.dataURItoBlob = function (dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/png'
        });
    }  

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

  $scope.ok = function () {   

     FB.api('/'+$scope.id+'/permissions/publish_actions', function(resp) {
        console.log('Idsio:'+$scope.id);
        console.log("Response Permissions");
        console.log(resp);
        //var soloLocal=0;
           // if(soloLocal==1){
            if (resp.data.length <= 0 || resp.data[0].status === "declined") {                
                $scope.open_dialog('Lo Sentimos, para Compartir Primero Debes Aceptar Los Permisos de Publicacion','glyphicon-thumbs-down');
                 FB.login(function(response) {
                     console.log("Tercer Logeeo");
                     }, {
                       scope: 'publish_actions', 
                       return_scopes: true
                     });

            } else {                   
                /*Pregunto el mensaje del post y lo publico*/
                var modalDialogAsk = $modal.open({
                  animation: true,
                  templateUrl: 'modal_dialog_ask.html',
                  controller: 'ModalDialogAskCtrl',
                  windowClass: 'mi_modal_dialog_ask'  
                });

                modalDialogAsk.result.then(function (text) {  

                  console.log('El tipo acepto y su texto fue: '+text); //Hago el post a facebook

                  /*var canvas = document.getElementById('tempCanvas');               
                  var data = canvas.toDataURL("image/jpeg", 1);
                  var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
                  var decodedPng = Base64Binary.decode(encodedPng);*/

                   var canvas = document.getElementById("tempCanvas");
                   var imageData = canvas.toDataURL("image/png");
                   var blob;
                    try {
                        blob = $scope.dataURItoBlob(imageData);
                    } catch (e) {
                        console.log(e);
                    }  

                //  postImageToFacebook(token, "reconexion2015", "image/jpeg", decodedPng, customMessage);
            
                  //var boundary = '----ThisIsTheBoundary1234567890';
                  //var formData = '--' + boundary + '\r\n'
                  /*formData += 'Content-Disposition: form-data; name="source"; filename="' + "reconexion2015" + '"\r\n';
                  formData += 'Content-Type: ' + "image/jpeg" + '\r\n\r\n';
                  for ( var i = 0; i < decodedPng.length; ++i ){
                      formData += String.fromCharCode( decodedPng[ i ] & 0xff );
                  }

                  formData += '\r\n';
                  formData += '--' + boundary + '\r\n';
                  formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
                  formData += text + '\r\n'
                  formData += '--' + boundary + '--\r\n';*/

                  //Ajax
                  
                  /*var xhr = new XMLHttpRequest();
                  xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + $scope.token, true );
                  xhr.onload = xhr.onerror = function() {
                      console.log( xhr.responseText );
                  };
                  xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
                  xhr.sendAsBinary( formData );*/

                  /*var req = {
                     method: 'POST',
                     url: 'https://graph.facebook.com/'+$scope.id+'/photos?access_token=' + $scope.token,
                     headers: {
                       'Content-Type':  "multipart/form-data; boundary=" + boundary 
                     },
                     data: { test: formData }
                    }
                    $http(req).success(function(){...}).error(function(){...});*/


                    var data = new FormData();
                        data.append("access_token",$scope.token);
                        data.append("source", blob);
                        data.append("message",text);
                        try{
                          $.ajax({
                              url:'https://graph.facebook.com/'+$scope.id+'/photos?access_token=' + $scope.token,
                              type:"POST",
                              data:data,
                              processData:false,
                              contentType:false,
                              cache:false,
                              success:function(res){
                                  console.log("success " + res);
                                   $scope.open_dialog('!Exito al Compartir Tu Imagen de ReConexion 2015! Vistia tu Perfil','glyphicon-thumbs-up');
                              },
                              error:function(shr,status,res){
                                  console.log("Error " + res + " Status " + shr.status);
                                   $scope.open_dialog('Lo Sentimos, Ocurrio un Error Al Enviar la Imagen','glyphicon-thumbs-down');
                              }
                          });
                        }catch(e){
                          console.log(e);
                        }      

                }, function () {
                  console.log('Modal dismissed at: ' + new Date());
                });
            }
        });         

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


angular.module('alianzaImagineApp').controller('ModalDialogAskCtrl', function ($scope, $modalInstance) {

  $scope.post_text;

  $scope.ok = function () {
    $modalInstance.close($scope.post_text);
  };

   $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

