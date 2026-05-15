const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// ─── PayPal IPN: recibe el aviso de pago y suma los AB ───
exports.paypalIpn = functions.https.onRequest(async (req, res) => {
    const body = req.body;

    // Solo procesar pagos completados
    if (body.payment_status === 'Completed') {
        const userId = body.custom;              // El ID de Waevo que enviamos
        const itemNumber = body.item_number;     // El SKU del pack

        // Asignar AB según el pack comprado
        let amount = 0;
        if (itemNumber === 'ab_pack_3') amount = 3;
        else if (itemNumber === 'ab_pack_8') amount = 8;
        else if (itemNumber === 'ab_pack_20') amount = 20;

        if (userId && amount > 0) {
            // Sumar los AB
            const userRef = admin.database().ref(`alexbrowser_users/${userId}`);
            const snap = await userRef.once('value');
            const current = snap.val()?.ab || 0;
            await userRef.update({ ab: current + amount });
            console.log(`✅ PayPal IPN: +${amount} AB para ${userId}`);
        }
    }

    res.status(200).send('OK');
});
