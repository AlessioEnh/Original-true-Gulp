
// ******************************Slick - Слайдер
$(document).ready(function(){
	$('.slider').slick({
		slidesToShow: 1,
		slideToSkroll: 1,
		arrows: false,
		dots: false,
		asNavFor: '.gallery',
		draggable: false
	});

	$('.gallery').slick({
		slidesToShow: 2,
		slideToSkroll: 1,

		dots: true,
		speed: 1500,
		centerMode: true,
		centerPadding: '60px',
		asNavFor: '.slider',
		focusOnSelect: true
	});

	
});

	// Magnific PopUp

$(document).ready(function() {
	$('.popup-gallery').magnificPopup({
		delegate: 'a',
		// items: {
		// 	src: 'img/1.webp'
		// },
		type:'image',
		gallery: {
			enabled: true
		},
	});

	
});

