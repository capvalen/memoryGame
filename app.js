var app = new Vue({
  el: '#app',
  data: {
		message: 'Hola soy Vue!',
		modo: false,
		inicio: true,
		digitos: 6,
		segundos: 1,
		tiempoVencido: false,
		numerosArray: [],
		numerosRespuesta: [],
		mostrarInputs: false,
		mostrarRespuestas: false,
		comprueba: false,
		reiniciar:false,
		inputPlus: 0,
		bloquear: false,
		comienza:true,
		contadorInput:0,
		version:"1.0.65"
	},
	methods:{
		comenzar(){
			this.mostrarInputs = false;
			this.mostrarRespuestas = false;
			this.numerosArray.splice(0, this.numerosArray.length);
			this.numerosRespuesta.splice(0, this.numerosRespuesta.length);
			
			for(i=0; i<this.digitos/2; i++ ){
				this.numerosArray.push({dato: '', izquierda: '', derecha:''});
				this.numerosRespuesta.push({digito1: '', digito2: ''});
			}
			//console.log( this.numerosArray );
		},
		numeroAleatorios(){
			var temp='';
			for(i=0; i<this.digitos/2; i++ ){
				//this.numerosArray[i] = this.aleatorio();
				temp = ("0"+this.aleatorio()).toString(); 
				this.numerosArray[i].dato = temp.substring(temp.length-2);

				console.log( this.numerosArray[i].dato );

				
			}
			//console.log( this.numerosArray );
		},
		iniciar(){
			$('#numerosPadre').addClass('animated flash slower');
		},
		mostrarDatos(){
			this.numeroAleatorios();
			if(this.modo ){ //hacer rapido
				setTimeout(()=>{ this.comprueba=true; this.mostrarInputs=true; this.mostrarRespuestas = false;} , this.segundos*1000);
			}else{
				setTimeout(()=>{ this.comprueba=true; this.mostrarInputs=true; this.mostrarRespuestas = true;} , this.segundos*1000);
			}
		},
		aleatorio(){
			return Math.floor(Math.random() * (99 - 1 + 1) + 1);
			//console.log(aleato)
		},
		sumarDigito(){
			if( $('#txtDigitos').val()>=6 ){
				this.digitos = $('#txtDigitos').val()
				this.comenzar();
			}
		},
		comprobar(){
			//this.bloquear=true;
			$('#numerosPadre').removeClass('animated flash slower');
			if(! this.modo ){
				for (let index = 0; index < this.digitos/2; index++) {
					let numero = this.numerosArray[index].dato.toString();
					//console.log( numero );
					const d1 = parseInt( numero.substring(0, 1));
					const d2 = parseInt( numero.substring(2,1));
				
					if( d1 == parseInt(this.numerosRespuesta[index].digito1) ){
						//console.log( 'igual' );
						this.numerosArray[index].izquierda = "text-success";
					}else{
						//console.log('d nada')
						this.numerosArray[index].izquierda = "text-danger";
					}
					if( d2 == parseInt(this.numerosRespuesta[index].digito2) ){
						//console.log( 'igual' );
						this.numerosArray[index].derecha = "text-success";
					}else{
						//console.log('d nada')
						this.numerosArray[index].derecha = "text-danger";
					}
				}
			}
			this.mostrarInputs = false;
			this.reiniciar=true;
		},
		nuevo(){
			this.comenzar();
			this.inicio=true;
			this.comienza=true;
		},
		pruebaHijo(index){ console.log($(this)) /* accionHijo(index); */ },
		pruebaPadre(index){ accionPadre(index); }
		
	},
	
	computed:{
		
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

function unicoDigito(evt, valor){
	if(event.which != 8 && event.which != 46 && event.which != 37 && event.which != 39 && event.which != 116  ){ //backspace, delete, left, right, F5
		
		if(valor.toString().length>0){  evt.preventDefault(); }
	}else{
		return false;
	}
	
}
function keyPrimero(valor, item){ 
	if(valor>9){ item.value= valor.toString().substring(1,0);
		app.numerosRespuesta[ `${$(item).attr('data-id')}` ].digito1=valor.toString().substring(1,0); 
		$(item).next().focus();
	}else{
		$(item).next().focus();
	}
}
function keySegundo(valor, item){ 
	if(valor>9){ item.value= valor.toString().substring(1,0);
		app.numerosRespuesta[ `${$(item).attr('data-id')}` ].digito2=valor.toString().substring(1,0); 
		$(item).parent().next().find('.siguienteHermano').focus();
		}else{
			$(item).parent().next().find('.siguienteHermano').focus();
		}
}
$('#app').on( 'focus', 'input', function(){
	$(this).select();
})
/* $('#app').on('keypress', '.siguienteHermano', function (e) { console.log('buscar padre')
	//alert('presionado')
	//$(this).next().focus();
	if($(this).val().length>=1 ){
		e.preventDefault();
	}
	this.nextSibling.nextSibling.focus();
	
}); */
/* $('#app').on('keypress', '.siguientePadre', function (e) { console.log('buscar padre')
	if($(this).val().length>=1){
		e.preventDefault();
	}
	$(this).parent().next().find('.siguienteHermano').focus();
	//this.parent.querySelector('.siguienteHermano').focus();
}); */