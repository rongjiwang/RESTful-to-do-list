$(document).ready(function (e) {
    //add a adding button
    $('#add-todo').button({icons: {primary: "ui-icon-circle-plus"}}).click(function () {
        $('#new-todo').dialog('open');
    });
    //==================Add New Job===============
    $('#new-todo').dialog({
        modal: true, autoOpen: false, buttons: {
            "Add task": function () {
                var taskName = $('#task').val();
                //stop remembering user input
                $('#task').val('');
                if (taskName === "") {
                    return false;
                }
                var item = {
                    job:taskName,
                    description: '',
                    is_finished: false
                };
                $.post('/todo',item, function(data, status){

                    console.log(data[2].id+' 000');
                    console.log(item);
                });

                // add a tick
                var taskHTML = '<li><span class="done">%</span>';
                // add a edit button
                taskHTML += '<span class="edit">+</span>';
                // add a cross button
                taskHTML += '<span class="delete">x</span>';

                taskHTML += '<span class="task"></span>';

                taskHTML += '<span class="name"></span>';

                taskHTML += '<span class="id"></span></li>';

                var $newTask = $(taskHTML);
                $newTask.find('.task').text(taskName);
                $newTask.hide();

                $('#todo-list').prepend($newTask);
                //sort of animation part
                $newTask.show('clip', 250).effect('highlight', 1000);
                $(this).dialog('close');

            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        }
    });

    //==================Complete A Job===============
    $('#todo-list').on('click', '.done', function () {
        var $taskItem = $(this).parent('li');
        $taskItem.slideUp(250, function () {
            var $this = $(this);
            $this.detach();
            //hide edit class from completed task list
            $(this).find('.edit').hide();
            //add removed item to comp-list
            $('#completed-list').prepend($this);
            $this.slideDown();
            //drag and drop feature(connect with lists)
            $('.sortlist').sortable({
                connectWith: '.sortlist',
                cursor: 'pointer',
                placeholder: 'ui-state-highlight',
                cancel: '.delete,.edit,.done'
            });
        });
    });
    //==================Delete A Job===============
    $('.sortlist').on('click', '.delete', function () {
        var _this = (this);
        console.log(_this);
        //dialog box setup
        $('#confirm-box').attr('title', 'Confirm deletion').html("Do you want<br>to confirm<br>deletion?").dialog({
            modal: true, autoOpen: true, buttons: {
                "Confirm": function () {
                    $.ajax({
                        url: '/del/',
                    });
                    $(_this).parent().effect('puff', function () {
                        $(_this).remove();
                    });
                    $(this).dialog('close');
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            }
        });
    });

    //==================Edit a incomplete Job===============
    $('#todo-list').on('click', '.edit', function () {
        var _this = (this);
        //how existing value in input-box
        $('#taskE').val($(this).parent().find('.task').text());
        $('#nameE').val($(this).parent().find('.name').text());
        //console.log($(this).parent().find('.id').text());

        $('#name-edit').dialog({
            modal: true, autoOpen: true, buttons: {
                "Confirm": function () {
                    //retrieve data from current task bar
                    var taskInput = $('#taskE').val();
                    var nameInput = $('#nameE').val();
                    //replace with new value
                    $(_this).parent('li').find('.task').html(taskInput);
                    $(_this).parent('li').find('.name').html(nameInput);
                    $(this).dialog('close');
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            }
        });
    });


}); // end ready

//==================Load LIST From Database===============
//P5
function setup(){
    loadJSON('all', function(data){
        // add a tick
        var taskHTML = '<li><span class="done">%</span>';
        // add a edit button
        taskHTML += '<span class="edit">+</span>';
        // add a cross button
        taskHTML += '<span class="delete">x</span>';

        taskHTML += '<span class="task"></span>';

        taskHTML += '<span class="name"></span>';

        taskHTML += '<span class="id"></span></li>';

        for(var k in data){
            var $newTask = $(taskHTML);
            // assign attributes
            $newTask.find('.task').text(data[k].job);
            $newTask.find('.name').text(data[k].description);
            $newTask.find('.id').text(data[k].id).hide();

            if(data[k].is_finished) {
                $('#completed-list').prepend($newTask);
            }
            else{
                $('#todo-list').prepend($newTask);
            }
            //console.log('My array has at position ' + ', this value: ' +data[k].job);
        };

    });
}
//TODO handle get :id request in URL
//TODO handle all request in URL
//TODO add-job button should POST the data to server and store in the database
//TODO edit button should POST the data to server and update the data
//TODO delete button should DELETE the data from database through server



