$(document).ready(function (e) {
    $.ajax({
        url: '/todo',
        type: 'GET',
        dataType: 'json',
        success: (data) =>{
            // add a tick
            var taskHTML = '<li><span class="done">%</span>';
            // add a edit button
            taskHTML += '<span class="edit">+</span>';
            // add a cross button
            taskHTML += '<span class="delete">x</span>';
            taskHTML += '<span class="task"></span>';
            taskHTML += '<span class="name"></span>';
            taskHTML += '<span class="id"></span>';
            taskHTML += '<span class="type"></span></li>';

            for(var k in data){
                var $newTask = $(taskHTML);
                // assign attributes
                $newTask.find('.task').text(data[k].job);
                $newTask.find('.name').text(data[k].description);
                $newTask.find('.id').text(data[k].id).hide();
                $newTask.find('.type').text(data[k].is_finished).hide();
                if(data[k].is_finished) {
                    $('#completed-list').prepend($newTask);
                    $newTask.find('.edit').hide();

                }
                else{
                    $('#todo-list').prepend($newTask);
                }
            };
        },
        error: (res) =>{
            alert('Failed to read todo list.');
        }
    });
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
                //Create a new item
                $.ajax({
                    url: '/todo',
                    type: 'POST',
                    dataType: 'json',
                    data: item,
                    success: (data) =>{
                        console.log(data[0].id);
                        // add a tick
                        var taskHTML = '<li><span class="done">%</span>';
                        // add a edit button
                        taskHTML += '<span class="edit">+</span>';
                        // add a cross button
                        taskHTML += '<span class="delete">x</span>';

                        taskHTML += '<span class="task"></span>';

                        taskHTML += '<span class="name"></span>';

                        taskHTML += '<span class="id"></span>';

                        taskHTML += '<span class="type"></span></li>';

                        var $newTask = $(taskHTML);
                        $newTask.find('.task').text(taskName);
                        $newTask.find('.id').text(data[0].id).hide();
                        $newTask.find('.type').text(false).hide();
                        $newTask.find('.name').text('').hide();
                        $newTask.hide();

                        $('#todo-list').prepend($newTask);
                        //animation part
                        $newTask.show('clip', 250).effect('highlight', 1000);
                    },
                    error: (res) =>{
                        alert('Failed to add a new job.');
                    }
                });

                $(this).dialog('close');

            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        }
    });

    //==================Complete A Job===============
    $('#todo-list').on('click', '.done', function () {
        var _this = (this);
        var $taskItem = $(this).parent('li');
        $taskItem.slideUp(250, function () {
            var $this = $(this);
            $this.detach();
            //hide edit class from completed task list
            $(this).find('.edit').hide();
            //add removed item to comp-list
            $('#completed-list').prepend($this);
            $this.slideDown();

            var id = $(_this).parent().find('.id').text();
            var _job = $(_this).parent().find('.task').text();
            var _description = $(_this).parent().find('.name').text();

            //UPDATE an item
            $.ajax({
                url: '/todo/'+id,
                type: 'PUT',
                dataType: 'json',
                data: {job: _job, description: _description, is_finished:true},
                success: (res) =>{
                    //replace with new value
                   $($this).parent('li').find('.type').html(true);
                    $(_this).parent().find('.type').text(true);
                    console.log('hello');
                },
                error: (res) =>{
                    alert('Failed to update the job.');
                }
            });
            //drag and drop feature(connect with lists)
            $('.sortlist').sortable({
                connectWith: '.sortlist',
                cursor: 'pointer',
                placeholder: 'ui-state-highlight',
                cancel: '.delete,.edit,.done'
            });

        });
    });
    //==================Completed job back to to-do list===============
    $('#completed-list').on('click', '.done', function () {
        var _this = (this);
        var $taskItem = $(this).parent('li');
        $taskItem.slideUp(250, function () {
            var $this = $(this);
            $this.detach();
            //hide edit class from completed task list
            $(this).find('.edit').show();
            //add removed item to comp-list
            $('#todo-list').prepend($this);
            $this.slideDown();

            var id = $(_this).parent().find('.id').text();
            var _job = $(_this).parent().find('.task').text();
            var _description = $(_this).parent().find('.name').text();
            //console.log(id+'&&');
            //UPDATE an item
            $.ajax({
                url: '/todo/'+id,
                type: 'PUT',
                dataType: 'json',
                data: {job: _job, description: _description, is_finished:false},
                success: (data) =>{
                    //replace with new value
                    $($this).parent('li').find('.type').html(false);
                    $(_this).parent().find('.type').text(false);
                },
                error: (res) =>{
                    alert('Failed to update the job.');
                }
            });
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
        //dialog box setup
        $('#confirm-box').attr('title', 'Confirm deletion').html("Do you want<br>to confirm<br>deletion?").dialog({
            modal: true, autoOpen: true, buttons: {
                "Confirm": function () {
                    //Grab item's id
                    var id = $(_this).parent().find('.id').text();

                    //DELETE an item
                    $.ajax({
                        url: '/todo/'+id,
                        type: 'DELETE',
                        dataType: 'json',
                        data: {id: id},
                        success: (res) =>{
                            $(_this).parent().effect('puff', function () {
                                $(_this).remove();
                            });
                        },
                        error: (res) =>{
                            alert('Failed to delete the job.');
                        }
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
                    //Grab item's id
                    var id = $(_this).parent().find('.id').text();
                    var is_finished = $(_this).parent().find('.type').text();
                    console.log(taskInput+' '+nameInput+' '+id+' '+is_finished);
                    //UPDATE an item
                    $.ajax({
                        url: '/todo/'+id,
                        type: 'PUT',
                        dataType: 'json',
                        data: {job: taskInput, description: nameInput, is_finished:is_finished},
                        success: (data) =>{
                            //replace with new value
                            $(_this).parent('li').find('.task').html(taskInput);
                            $(_this).parent('li').find('.name').html(nameInput).show();
                        },
                        error: (res) =>{
                            alert('Failed to update the job.');
                        }
                    });

                    $(this).dialog('close');
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            }
        });
    });


}); // end ready

//==================Load LIST From Database(P*5 version)===============
//P5
/*
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
*/




