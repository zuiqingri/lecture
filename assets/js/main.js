var students = [];

var id;

// script to run when the page is loaded.
$( document ).ready(function() {
  console.log('[Page] loaded');

  buttonsReady();

  $('#add-student').on('click', function(e) {
    $('#first-name').val('');
    $('#last-name').val('');
    $('#age').val('');
    $('#score').val('');
    $('#ip-address').val('');
    $('#created-at').val('');
    $('#studentModal').modal('show');
  });

  $('#submit-student').on('click', function(e) {
    console.log('[Student Form] submit');
    const data = {
      id: generateId(),
      first_name: $('#first-name').val(),
      last_name: $('#last-name').val(),
      age: $('#age').val(),
      score: $('#score').val(),
      ip_address: $('#ip-address').val(),
      created_at: $('#created-at').val(),
    };

    students.push(data);

    listStudents();

    $('#studentModal').modal('hide');
  });

  $( "#studentForm" ).on( "submit", function(e) {
    e.preventDefault();

    if(!id) {
      id = generateId();
      var student = {
        id: id,
        name: $('#studentForm [name="name"]').val(),
        age: $('#studentForm [name="age"]').val(),
        cpf: $('#studentForm [name="cpf"]').val()
      }
      if(student.name) {
        students.push(student);
      }
    }
    else {
      var idx = getStudentidx(id);
      students[idx].name = $('#studentForm [name="name"]').val();
      students[idx].age = $('#studentForm [name="age"]').val();
      students[idx].cpf = $('#studentForm [name="cpf"]').val();
    }



    listStudents();
    clearForm();
    id = null;
  });

  // $(document).on('click','#btnPrepend',function(){//do something})

  $( "#studentList" ).on( "click", '.deleteStudent', function(e) {
    // e.preventDefault();
    var studentId = $(this).parent('tr').attr('id');
    var idx = getStudentidx(studentId);
    if(idx) {
      students.splice(idx,1)
      // deleteStudent(id);
      // $(this).parent('tr').remove();
    }
  } );
});

function buttonsReady() {
  // $("#studentForm").submit(function(e) {

  // });

  // $(".deleteStudent").click(function (e) {


  // });

  $(".editStudent").click(function (e) {
    e.preventDefault();
    id = $(this).parent('tr').attr('id');
    var student = getStudent(id);
    if(student) {
      $('#studentForm [name="name"]').val(student.name);
      $('#studentForm [name="age"]').val(student.age);
      $('#studentForm [name="cpf"]').val(student.cpf);
    }

  });
}


function listStudents() {
  $('#studentList tbody').remove();

  $('#studentList').append('<tbody></tbody>');

  var studentList = '';
  // students.forEach(function(student, i) {
  students.forEach((student, i) => {
    // studentList = studentList + 1;
    // studentList += 1;

    studentList +=
    `<tr id="${i + 1}">
      <td>${student.id}</td>
      <td>${student.first_name}</td>
      <td>${student.last_name}</td>
      <td>${student.age}</td>
      <td>${student.score}</td>
      <td>${student.ip_address}</td>
      <td>${student.created_at}</td>
      <td class="center">
        <i class="editStudent fa fa-pencil"></i>
        <i class="deleteStudent fa fa-trash"></i>
      </td>
    </tr>`;
  });
  $("#studentList tbody").append(studentList);
}

function getStudent(id) {
  return students[students.findIndex(item => item.id == id)];
}

function getStudentidx(id) {
  return students.findIndex(item => item.id == id);
}

function generateId () {
  var id =  Math.floor(Math.random() * 10000);
  students.forEach(function(student) {
    if(student.id == id) return false;
  });

  return id;
}

function clearForm() {
  $( '#studentForm' ).each(function(){
    this.reset();
  });
}
