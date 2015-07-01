var Status = (function() {



  $(function() {

    //TODO: Remove after test
    $(document).unbind();
    $(document).keydown(function(e) {
      switch (e.which) {
        case 37: // left
          left();
          console.log('l');
          break;

        case 39: // right
          right();
          console.log('r');
          break;

        default:
          return;
      }
      e.preventDefault();
    });


  });






	function left() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}


})();
