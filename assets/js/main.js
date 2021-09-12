var students = [];
const storeKey = 'STUDENT_LIST';

var id='';

// script to run when the page is loaded.
$( document ).ready(function() {
  console.log('[Page] loaded');

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
    if (id === '') {
      const data = {
        id: generateId(),
        first_name: $('#first-name').val(),
        last_name: $('#last-name').val(),
        age: $('#age').val(),
        score: $('#score').val(),
        ip_address: $('#ip-address').val(),
        created_at: $('#created-at').val(),
      };
      // students.push(data);
      addStudentRequest(data);
    } else {
      const student = students[id];

      const data = {
        id: student['id'],
        first_name: $('#first-name').val(),
        last_name: $('#last-name').val(),
        age: $('#age').val(),
        score: $('#score').val(),
        ip_address: $('#ip-address').val(),
        created_at: $('#created-at').val(),
      };

      students[id] = data;
    }

    saveStudents();

    listStudents();

    $('#studentModal').modal('hide');

    id = '';
  });


  loadStudentsRequest();
  // loadStudents();
  // listStudents();

  buttonsReady();

  $('#studentList').on('click', '.editStudent', function(e) {
    // console.log('I want to edit this.');
    e.preventDefault();
    // const student_id = Number($(this).parents('tr').attr('id'));
    const student_id = $(this).parents('tr').attr('id');
    
    console.log('[Student id]', student_id);
    
     getStudentInfo(student_id);
    // const student = students[student_id];
    
    id = student_id;
    updateStudentRequest(id);
    
  //   id = $(this).parent('tr').attr('id');
  //   var student = getStudent(id);
  //   if(student) {
  //     $('#studentForm [name="first"]').val(student.First);
  //     $('#studentForm [name="last"]').val(student.Last);
  //     $('#studentForm [name="age"]').val(student.Age);
  //     $('#studentForm [name="score"]').val(student.Score);
  //     $('#studentForm [name="ipaddress"]').val(student.IPAddress);
  //     $('#studentForm [name="createdat"]').val(student.CreatedAt);
  //   }

  // });

    
  });


  $( "#studentList" ).on( "click", '.deleteStudent', function(e) {
    console.log('[Delete Item]')
    const student_id = Number($(this).parents('tr').attr('id'));

    students.splice(student_id, 1);

    saveStudents();

    listStudents();
    // e.preventDefault();
    // var studentId = $(this).parent('tr').attr('id');
    // var idx = getStudentidx(studentId);
    // if(idx) {
    //   students.splice(idx,1)
    //   // deleteStudent(id);
    //   // $(this).parent('tr').remove();
    // }
  } );

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

    let color = '';
    

    studentList +=
    `<tr id="${student._id}">
      <td>${i + 1}</td>
      <td>${student.first_name}</td>
      <td>${student.last_name}</td>
      <td>${student.age}</td>
      <td style="color: ">${student.score}</td>
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

function saveStudents() {
  const data_str = JSON.stringify(students);
  localStorage.setItem(storeKey, data_str);
}

function loadStudents() {
  let data_str = localStorage.getItem(storeKey);
  data_str = data_str ? data_str : '[]';
  students = JSON.parse(data_str);
}

function loadStudentsRequest(){
  $.ajax({
    url: "http://localhost:8080/students",
    cache: false,
    success: function(result){
      // $("#results").append(html);
      console.log('[API Response]',result);
      students = result;
      listStudents();
    }
  });
}

function addStudentRequest(data){
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/students',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
   
    success: function (result) {
      students.push(result);
      listStudents();
    }
});
}

function getStudentInfo(id)
{
  console.log('[Student ID]', id);
  $.ajax({
    type: 'get',
    // url: 'http://localhost:8080/students/' + id,
    url: `http://localhost:8080/students/${id}`,
    // data: JSON.stringify(data),
    // contentType: "application/json; charset=utf-8",
   
    success: function (result) {
      // students.push(result);
      // listStudents();
      const student=result;
      console.log('[Student Info]', result);
    $('#first-name').val(student.first_name);
    $('#last-name').val(student.last_name);
    $('#age').val(student.age);
    $('#score').val(student.score);
    $('#ip-address').val(student.ip_address);
    $('#created-at').val(student.created_at);
    $('#studentModal').modal('show');
    }
});
}

function updateStudentRequest(id){
  $.ajax({
    type: 'put',
    url: `http://localhost:8080/students/${id}`,
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
   
    success: function (result) {
      students.push(result);
      listStudents();
    }
});
}