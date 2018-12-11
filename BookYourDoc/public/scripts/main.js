$(document).ready(function () {
    console.log("Hello World")

    function specFunction(data) { 
        console.log(data);

     }
    $('.docSpex').change(function() {
        var $this = $(this);
        console.log($this.val());
        //On change of that value, search it dynamically and display another list and so on../
        //How to get the data from 

    });

});