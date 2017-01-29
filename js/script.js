/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Zepto(function($){

    // Setup the root url for the RESTful services
    var rootURL = 'http://slim.dev/api/';
    var currentCar;
    
    $(document).on('ajaxBeforeSend', function(e, xhr, options){
        // This gets fired for every Ajax request performed on the page.
        // The xhr object and $.ajax() options are available for editing.
        // Return false to cancel this request.
    });
    
    // Retrieve car list when application starts
    findAll();
    
    // Nothing to delete in initial application state
    $('#btnDelete').hide();
    
    // Retrieve car details when list item is clicked
    $('#car-list a').live('click', function() {
        findById($(this).data('identity'));
    });
    
    // Call new car function when button is clicked
    $('#btnAdd').click(function() {
        newCar();
        return false;
    });
    
    // Call delete car function when button is clicked
    $('#btnDelete').click(function() {
        deleteCar();
        return false;
    });
    // Hide delete button and empty out form
    function newCar() {
        $('#btnDelete').hide();
        currentCar = {};
        renderDetails(currentCar); // Display empty form
    }

    // Call add car function when save button is clicked
    $('#btnSave').click(function() {
        if($('#id').val() == ''){
            addCar();
        }else{
            updateCar();
        }
        return false;
    });
    
       
    // Get all cars
    function findAll() {
        $.ajax({
            type: 'GET',
            url: rootURL + 'cars',
            dataType: 'json',
            success: function(response){
                console.log('Success: ', response);
                renderList(response);
            },
            error: function(xhr, type){
               console.log(xhr, type);
            }
        });
    }
    
    // Render list of all cars
    function renderList(data) {
        $('#car-list li').remove();
        $.each(data, function(index, car) {
            $('#car-list').append('<li><a href="#" data-identity="' + car.id + '">' + car.model + '</a></li>');
        });
    }
    
    // Get car by id
    function findById(id) {
        console.log('findById:' + id);
        $.ajax({
            type: 'GET',
            url: rootURL + 'cars/' + id,
            dataType: 'json',
            success: function(data){
                $('#btnDelete').show();
                console.log('findById success: ' + data);
                currentCar = data;
                renderDetails(currentCar);
            },
            error: function(xhr, type){
               console.log(xhr, type);
            }
        });
    }
    
    // Add new car
    function addCar() {
        console.log('addCar');
        $.ajax({
            type: 'POST',
            url: rootURL + 'car',
            dataType: 'json',
            data: $.param(getForm()), // URI encode data for request
            success: function(data, xhr, type, textStatus) {
                console.log(data, xhr, type, textStatus);
                alert('Car added successfully');
                $('#btnDelete').show();
                $('#id').val(data.id);
                findAll(); // reload list
            },
            error: function(xhr, type, textStatus, errorThrown) {
                console.log(xhr, type, errorThrown, textStatus);
            }
        });
    }   
    
    // Delete a car
    function deleteCar($id) {
        console.log('deleteCar');
        $.ajax({
            type: 'DELETE',
            url: rootURL + 'car/' + $('#id').val(),
            success: function(data, xhr, type, textStatus) {
                console.log(data, xhr, type, textStatus);
                alert('Car successfully deleted');
                newCar(); // zero out the form
                findAll(); // reload list
            },
            error: function(xhr, type, textStatus, errorThrown) {
                console.log(xhr, type, errorThrown, textStatus);
            }
        })
    }
    
    
    // Render detail view
    function renderDetails(car) {
        if($.isEmptyObject(car)){
            $('#id').val('');
            $('#year').val('');
            $('#make').val('');
            $('#model').val('');
        }else{
            $('#id').val(car[0].id);
            $('#year').val(car[0].year);
            $('#make').val(car[0].make);
            $('#model').val(car[0].model);
        }
    }
    
    // Helper function to get form fields
    function getForm() {
        var car = {
            'year': $('#year').val(),
            'make': $('#make').val(),
            'model': $('#model').val()
        };
        return car;
    }

});
