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

function predict_length(width) {
    if (width <= 2.4) {
        return 5;
    } else {
        return 10;
    }
}

function predict_accn1(speed) {
    switch (true) {
        case speed < 19.6:
            return 0.89;
        case speed < 22.4:
            return 0.80;
        case speed < 25.17:
            return 0.72;
        default:
            return 0.73;
    }
}

function predict_accn2(speed) {
    switch (true) {
        case speed < 22.4:
            return 0.53;
        case speed < 25.17:
            return 0.41;
        default:
            return 0.51;
    }
}

var v_a, v_b, v_c, w, D, s, lA, xA, xB, xC;
var a;                       // Acceleration of car B.
var fr = 120;                // Frame rate (fps).
var sd1 = 5;
var sd2 = 25;                 // Safe distance after overtake (m).
var lB = 5;                   // Length of car B (m).

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Snippet to update text fields by sliders, and vice versa.
$(document).ready(function () {
    function update_form_1() {
        $('#vA').val($('#vAs').val());
        $('#vB').val($('#vBs').val());
        $('#vC').val($('#vCs').val());
        $('#D').val($('#Ds').val());
        $('#s').val($('#ss').val());
    }
    function update_form_2() {
        $('#vAs').val($('#vA').val());
        $('#vBs').val($('#vB').val());
        $('#vCs').val($('#vC').val());
        $('#Ds').val($('#D').val());
        $('#ss').val($('#s').val());
    }
    function update_road() {
        let l = (parseFloat($('#ss').val()) + lB) / (2 * lB + parseFloat($('#Ds').val())) * 100;
        let zf = (2 * lB + 200) / (2 * lB + parseFloat($('#Ds').val()))
        w = zf * 2.38;
        road_width = 2.86 * zf;
        car_width = 0.95 * zf;
        $('#carA').css('left', l.toString() + '%');
        $('img').css('width', w.toString() + '%');
        $('img').css('height', car_width.toString() + 'vw');
        $('#top-view').css('height', road_width.toString() + 'vw')
    }
    update_form_1();
    $('input[type=\'range\']').on('input', function () {
        update_form_1();
        update_road();
    });
    $('input[type=\'text\']').on('input', function () {
        update_form_2();
        update_road();
    });
    setTimeout(function () {
        $('form').css('transform', 'scaleX(1) scaleY(0.1)');
    }, 200);
    setTimeout(function () {
        $('form').css('transform', 'scaleX(1) scaleY(1)');
        $('form').css('border-top', 'solid 1px');
        $('form').css('border-bottom', 'solid 1px');
        $('#top-view').css('transform', 'scaleY(1)');
    }, 800);
    setTimeout(function () {
        $('form table').css('opacity', '1');
        $('img').css('opacity', '1');
    }, 1200);

    // On submit, disable inputs and store initial measurements.
    $('input[type=\'button\']').click(function () {
        $('input').prop('disabled', 'true').css('cursor', 'default');

        v_a = parseFloat($('#vAs').val()) * 5 / 18;
        v_b = parseFloat($('#vBs').val()) * 5 / 18;
        v_c = - parseFloat($('#vCs').val()) * 5 / 18;
        a = predict_accn1(v_a);

        w = parseFloat($('#wA').val());
        D = parseFloat($('#Ds').val());
        s = parseFloat($('#ss').val());
        lA = predict_length(w);

        // xI represents the head of the engine bonnet of car I.
        xA = lB + s + lA;
        xB = xA - s - lA;
        xC = xB + D;

        xp_rate = 100 / (D + 2 * lB);
        ax = (xA - lA) * xp_rate;
        bx = 0;
        cx = 0;

        $('#carB').css('top', '56.66%');

        play();
    });

    function update_form(fD, fs, fv_b) {
        $('#Ds').val(fD);
        $('#ss').val(fs);
        $('#vBs').val(fv_b * 18 / 5);
        $('#D').val(Math.max(parseInt(fD), 0));
        $('#s').val(Math.max(parseInt(fs), 0));
        $('#vB').val(parseInt(fv_b * 18 / 5));
    }

    /**
     * Update the position of the cars per frame.
     */
    async function play() {
        var bl = 0;
        while (true) {
            let duration = 1 / fr;

            vb_old = v_b;
            v_b += a * duration;
            if (v_b > 80 * 5 / 18) v_b = 80 * 5 / 18;
            vb_av = (v_b + vb_old) / 2;

            xB += duration * vb_av;
            bx += duration * vb_av * xp_rate;
            $('#carB').css('left', bx.toString() + '%');
            xA += duration * v_a;
            ax += duration * v_a * xp_rate;
            $('#carA').css('left', ax.toString() + '%');
            xC += duration * v_c;
            cx -= duration * v_c * xp_rate;
            $('#carC').css('right', cx.toString() + '%');

            D = (xC >= xB) ? (xC - xB) : (xB - xC - 2 * lB);
            s = (xB <= xA) ? (xA - xB - lA) : (xB - xA - lB);

            if (xB >= xA) a = predict_accn2(v_a);

            function ret () {
                if (xB >= xC) {
                    bl = 2;
                    return;
                }

                if (xB + sd2 >= xC) {
                    $('form').css('background', '#f004');
                    $('input[type=\'button\']').val('Reset').removeAttr('disabled').css('cursor', 'pointer');
                    $('input[type=\'button\']').click(function () {
                        location.reload();
                    });
                    bl = 0;
                    return;
                }
    
                if (xA + lB + sd1 <= xB) {
                    $('form').css('background', '#0f04');
                    $('input[type=\'button\']').val('Reset').removeAttr('disabled').css('cursor', 'pointer');
                    $('input[type=\'button\']').click(function () {
                        location.reload();
                    });
                    bl = 1;
                    return;
                }
            }

            if (bl === 0) ret();
            else if (bl === 2) return;

            if (xA <= xB - lB) {
                $('#carB').css('top', '10%');
            }

            update_form(D, s, v_b);
            await sleep(duration * 1000);
        }
    }
});
