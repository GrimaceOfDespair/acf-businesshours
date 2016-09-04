(function($){
	
	
	function initialize_field( $el ) {
		
		var $businessHours = $el.find(".businesshours");
		var $dataField = $el.find("input");
    
    var data;
    try {
      data = JSON.parse($dataField.val());
    } catch(e) {
      data = {};
    }
		
		var businessHoursManager = $businessHours.businessHours({
      operationTime: data,
			postInit: function(){
				
				$('.operationTimeFrom, .operationTimeTill').timepicker({
					timeFormat: 'H:i',
					step: 15,
				});
			},
		});
		
		$businessHours.on('sync', function() {
			$dataField.val(JSON.stringify(businessHoursManager.serialize()));
		});
	}
	
	
	if( typeof acf.add_action !== 'undefined' ) {
	
		/*
		*  ready append (ACF5)
		*
		*  These are 2 events which are fired during the page load
		*  ready = on page load similar to $(document).ready()
		*  append = on new DOM elements appended via repeater field
		*
		*  @type	event
		*  @date	20/07/13
		*
		*  @param	$el (jQuery selection) the jQuery element which contains the ACF fields
		*  @return	n/a
		*/
		
		acf.add_action('ready append', function( $el ){
			
			// search $el for fields of type 'businesshours'
			acf.get_fields({ type : 'businesshours'}, $el).each(function(){
				
				initialize_field( $(this) );
				
			});
			
		});
		
		acf.add_action('sortstart', function( $el ){
			
			// $el will be equivalent to the new element being moved $('tr.row')
			
			
			// find a specific field
			var $field = $el.find('#my-wrapper-id');
			
			
			// do something to $field
			
		});
		
	} else {
		
		
		/*
		*  acf/setup_fields (ACF4)
		*
		*  This event is triggered when ACF adds any new elements to the DOM. 
		*
		*  @type	function
		*  @since	1.0.0
		*  @date	01/01/12
		*
		*  @param	event		e: an event object. This can be ignored
		*  @param	Element		postbox: An element which contains the new HTML
		*
		*  @return	n/a
		*/
		
		$(document).on('acf/setup_fields', function(e, postbox){
			
			$(postbox).find('.field[data-field_type="businesshours"]').each(function(){
				
				initialize_field( $(this) );
				
			});
		
		});
		
    $(document).on('submit', '#post', function() {
      
      $('.businesshours').trigger('sync');
      
    })	
	}


})(jQuery);
