(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of majorclass id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajorClass(record_id){
    return $.get("http://localhost:1337/majorclass/" + record_id, function(data){
      console.log("got majorclass");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageMajorClassForm = $("#manageMajorClassForm");
    let addMajorClassButton = $("#addMajorClassButton");

    $(document).ready(function() {
      $('#majorclassTable').DataTable({
        columnDefs: [
            { width: 150, targets: 3 }
        ],
        dom: 'Bfrtip',
        colReorder: true,
        "scrollX": true,
        buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
        ]
      });
    });


    //add majorclass button functionality
    addMajorClassButton.click(function(){
      manageMajorClassForm.trigger('reset');
      manageMajorClassForm.attr("action", "/create_majorclass");
      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })

  	$("#majorclassTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("majorclassid")
      manageMajorClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajorClassForm.attr("action", "/update_majorclass");
      let majorclass = getMajorClass(recordId);

      //populate form when api call is done (after we get majorclass to edit)
      majorclass.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })



      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })


    $("#majorclassTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("majorclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete MajorClass": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
