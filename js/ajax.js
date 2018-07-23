"use strict";



// Search functionality
$('#search').on('input', function(e) {
	e.preventDefault();
  $.get(`/items/index?search=${encodeURIComponent(e.target.value)}`, function(data) {
		$('#item-box').html('');
		data.forEach(function(item){
			$('#item-box').append(
				`
				 <div class="col-md-3 col-sm-6">
                    <div class="thumbnail">
                        <img src="${ item.image}">
                        <div class="caption">
                           <h4>${ item.name}</h4>
                        </div> 
                        <p>
                            <a href="/items/${ item.id }" class="btn btn-primary">More info</a>
                        </p>
                         
                    </div> 
                </div>
				
				`
				);
		});
	});
});