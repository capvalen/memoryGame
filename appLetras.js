var app = new Vue({
  el: '#app',
  data: {
		message: 'Hola soy Vue!',
		modo: false,
		inicio: true,
		digitos: 5,
		segundos: 3, //3
		tiempoVencido: false,
		letrasArray: [],
		numerosRespuesta: [],
		mostrarInputs: false,
		mostrarRespuestas: false,
		comprueba: false,
		reiniciar:false,
		inputPlus: 0,
		bloquear: false,
		idPalabras: '',
		tempo: [],
		desorden: [],
		hayRespuesta:false,
		mostrarFinal:false,
		comienza:true,
		version: "1.0.18", repetidos:[]
	},
	methods:{
		comenzar(){
			this.mostrarInputs = false;
			this.mostrarRespuestas = false;
			this.letrasArray.splice(0, this.letrasArray.length);
			this.numerosRespuesta.splice(0, this.numerosRespuesta.length);
			
			for(i=0; i<this.digitos; i++ ){
				this.letrasArray.push({dato: '', resultado: ''});
				this.numerosRespuesta.push({digito1: '', digito2: ''});
			}
			//console.log( this.letrasArray );
		},
		letrasAleatorios(){
			for(i=0; i< this.digitos; i++ ){
				this.letrasArray[i].dato = this.tempo[i].palabra;
				this.desorden.push(this.tempo[i].palabra)
				this.desorden = app.desorden.sort(() => Math.random()- parseFloat(Math.random()).toFixed(1) )
			}
			this.tempo.splice(0, this.tempo.length);
			this.tempo = this.desorden;
			//console.log( this.desorden );
		},
		iniciar(){
			
			this.cargarPalabras();
			this.idPalabras = this.idPalabras.substring(0, this.idPalabras.length-1);
			console.log( 'serie='+ this.idPalabras );

			
			fetch('https://medmemorygroup.com/app/darPalabras.php?palabras='+this.idPalabras,{
				credentials: 'same-origin'
			})
			.then(function(response) {
				return response.json();
			})
			.then((myJson)=> {
				this.tempo = myJson;
				//console.log(this.tempo);
				$('#numerosPadre').addClass('animated flash slower');
			});
			
		},
		mostrarDatos(){
			this.letrasAleatorios();
			if(this.modo ){ //hacer rapido
				setTimeout(()=>{ this.comprueba=true; this.mostrarInputs=true; this.mostrarRespuestas = false;} , this.segundos*1000);
			}else{
				setTimeout(()=>{ this.comprueba=true; this.mostrarInputs=true; this.mostrarRespuestas = true;  } , this.segundos*1000);
				
			}
		},
		aleatorio(){
			return Math.floor(Math.random() * (698 - 1 + 1) + 1);
		},
		sumarDigito(){ //console.log( $('#txtDigitos').val() );
			if( $('#txtDigitos').val()>=5 && $('#txtDigitos').val()<= 15 ){
				this.digitos = $('#txtDigitos').val()
				this.comenzar();
			}
		},
		comprobar(){
			this.hayRespuesta=true;
			$('#numerosPadre').removeClass('animated flash slower');
			if(! this.modo ){
				for (let index = 0; index < this.digitos; index++) {
					if(this.letrasArray[index].dato == this.tempo[index]){
						this.letrasArray[index].resultado = 'text-success';
					}else{
						this.letrasArray[index].resultado = 'text-danger';
					}
				}
			}
			this.mostrarInputs = false;
			this.reiniciar=true;
		},
		nuevo(){
			this.comenzar();
			this.inicio=true;
			this.hayRespuesta=false;
			this.comienza=true;
			this.repetidos=[];
			
			this.desorden.splice(0, this.desorden.length);
		},
		cargarPalabras(){
			this.idPalabras =''; var alea='';
			for (let index = 0; index < this.digitos; index++) {
				alea = this.aleatorio();
				if( this.repetidos.indexOf( alea )=="-1"){
					this.repetidos.push(alea)
					this.idPalabras = this.idPalabras+alea+',' ;
				}else{  console.log( "repetido "+ alea );
					index--;
				}
			}
		},
		reordernar(anterior, nuevo){ 
			console.log( 'anterior: ' + anterior + ' nuevo: '+ nuevo );
			if(anterior < nuevo ){ console.log( 'caso para abajo' );
				let valAnt = this.tempo[anterior];
				for(let i=anterior; i<nuevo; i++){
					this.tempo[i] = this.tempo[i+1]
				}
				this.tempo[nuevo] = valAnt;
				console.log( this.tempo );
			}else{ console.log( 'caso para arriba' );
				let valNuevo = this.tempo[anterior]; console.log( 'moviendo: '+ valNuevo );
				for(let i=anterior; i>nuevo; i--){
					this.tempo[i] = this.tempo[i-1]
				}
				this.tempo[nuevo] = valNuevo;
				console.log( this.tempo );
			}
		}
	},

	mounted(){
		
	}
});
app.comenzar();

function animateCSS(element, animationName, callback) {
	const node = document.querySelector(element)
	node.classList.add('slower')
	node.classList.add('animated', animationName)

	function handleAnimationEnd() {
			node.classList.remove('slower', animationName)
			node.classList.remove('animated', animationName)
			node.removeEventListener('animationend', handleAnimationEnd)

			if (typeof callback === 'function') callback()
	}

	node.addEventListener('animationend', handleAnimationEnd)
}

addEventListener('animationend', function() { app.mostrarDatos(); app.comienza=false; });

$('#app').on('keypress', '.siguienteHermano', function (e) {
	$(this).next().focus();
});
$('#app').on('keypress', '.siguientePadre', function (e) {
	$(this).parent().next().find('.siguienteHermano').focus();
});
$('#app').on('mouseenter', '.itemMovible', function (e) {
	$('#simpleList').sortable({
		dataIdAttr: 'data-id',
		onEnd: function(/**Event*/evt) {
			app.reordernar(evt.oldIndex, evt.newIndex);
		},
	});
});
$('#txtDigitos').focusout(function () {
	if( $('#txtDigitos').val()>15 ){
		$('#txtDigitos').val(15)
	}else if( $('#txtDigitos').val()<5 ){
		$('#txtDigitos').val(5)
	}
})