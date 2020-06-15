/*
---------------------------------------------
 [CAR B>    [CAR A>
 --------------------------------------------
                                    <CAR C]
 --------------------------------------------
Initial measurements:-
v_i :   Speed of car I, I = A, B, C.
w   :   Width of car A.
D   :   Distance between car A and car C.
*/

// Snippet to update text fields by sliders, and vice versa.
$(document).ready(function () {
    function update_form_1() {
        $('#vA').val($('#vAs').val());
        $('#vB').val($('#vBs').val());
        $('#D').val($('#Ds').val());
        $('#s').val($('#ss').val());
    }
    function update_form_2() {
        $('#vAs').val($('#vA').val());
        $('#vBs').val($('#vB').val());
        $('#Ds').val($('#D').val());
        $('#ss').val($('#s').val());
    }
    update_form_1();
    update_output();
    $('form div input[type=\'range\']').on('input', function () {
        update_form_1();
        update_output();
    });
    $('form div input[type=\'text\']').on('input', function () {
        update_form_2();
        update_output();
    });
});

/**
 * Creates a prediction model with specified hyperparameter of safe distance.
 * @param   {number}    s   The safe distance maintained between cars A and B in acc. overtake.
 * @returns {Object}        The prediction model.
 */
function Model(s) {
    const model = {};
    model.s = s;
    return model;
}

model1 = new Model(10);

/**
 * Updates the output everytime the form is updated.
 */
function update_output() {
    var sum = 0;
    $('input').each(function () {
        sum += parseFloat($(this).val());
    });
    $('#output').html(sum);
}