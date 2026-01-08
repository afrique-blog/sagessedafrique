import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Accepter les certificats auto-signés (serveur Plesk)
    rejectUnauthorized: false,
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || 'noreply@sagessedafrique.blog';
const FROM_NAME = process.env.SMTP_FROM_NAME || "Sagesse d'Afrique";
const SITE_URL = process.env.SITE_URL || 'https://sagessedafrique.blog';

// Templates d'emails
const templates = {
  verifyEmail: (name: string, token: string, lang: string = 'fr') => {
    const verifyUrl = `${SITE_URL}/verification-email?token=${token}`;
    
    if (lang === 'en') {
      return {
        subject: 'Verify your email - Sagesse d\'Afrique',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
              <p style="color: #d4a574; margin: 5px 0;">African Intellectual Heritage</p>
            </div>
            
            <h2 style="color: #1e3a5f;">Welcome ${name}!</h2>
            
            <p>Thank you for joining our community. Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Verify my email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
            
            <p style="color: #666; font-size: 14px;">If you didn't create an account, you can ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Sagesse d'Afrique. All rights reserved.
            </p>
          </div>
        `,
      };
    }
    
    return {
      subject: 'Vérifiez votre email - Sagesse d\'Afrique',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
            <p style="color: #d4a574; margin: 5px 0;">L'Héritage Intellectuel Africain</p>
          </div>
          
          <h2 style="color: #1e3a5f;">Bienvenue ${name} !</h2>
          
          <p>Merci de rejoindre notre communauté. Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Vérifier mon email
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Ce lien expire dans 24 heures.</p>
          
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Sagesse d'Afrique. Tous droits réservés.
          </p>
        </div>
      `,
    };
  },

  resetPassword: (name: string, token: string, lang: string = 'fr') => {
    const resetUrl = `${SITE_URL}/reinitialiser-mot-de-passe?token=${token}`;
    
    if (lang === 'en') {
      return {
        subject: 'Reset your password - Sagesse d\'Afrique',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
            </div>
            
            <h2 style="color: #1e3a5f;">Password Reset</h2>
            
            <p>Hello ${name},</p>
            
            <p>You requested to reset your password. Click the button below to create a new one:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Reset my password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
            
            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email. Your password won't change.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Sagesse d'Afrique. All rights reserved.
            </p>
          </div>
        `,
      };
    }
    
    return {
      subject: 'Réinitialisation de mot de passe - Sagesse d\'Afrique',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
          </div>
          
          <h2 style="color: #1e3a5f;">Réinitialisation de mot de passe</h2>
          
          <p>Bonjour ${name},</p>
          
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>
          
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Sagesse d'Afrique. Tous droits réservés.
          </p>
        </div>
      `,
    };
  },

  welcomeEmail: (name: string, lang: string = 'fr') => {
    if (lang === 'en') {
      return {
        subject: 'Welcome to Sagesse d\'Afrique!',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
              <p style="color: #d4a574; margin: 5px 0;">African Intellectual Heritage</p>
            </div>
            
            <h2 style="color: #1e3a5f;">Welcome to the community, ${name}!</h2>
            
            <p>Your account is now active. You can now:</p>
            
            <ul>
              <li>💬 Comment on articles</li>
              <li>⭐ Save your favorite articles</li>
              <li>📚 Track your reading history</li>
              <li>🔔 Receive personalized notifications</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}" style="background-color: #d4a574; color: #1e3a5f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Start exploring
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Sagesse d'Afrique. All rights reserved.
            </p>
          </div>
        `,
      };
    }
    
    return {
      subject: 'Bienvenue sur Sagesse d\'Afrique !',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3a5f; margin: 0;">Sagesse d'Afrique</h1>
            <p style="color: #d4a574; margin: 5px 0;">L'Héritage Intellectuel Africain</p>
          </div>
          
          <h2 style="color: #1e3a5f;">Bienvenue dans la communauté, ${name} !</h2>
          
          <p>Votre compte est maintenant actif. Vous pouvez désormais :</p>
          
          <ul>
            <li>💬 Commenter les articles</li>
            <li>⭐ Sauvegarder vos articles favoris</li>
            <li>📚 Suivre votre historique de lecture</li>
            <li>🔔 Recevoir des notifications personnalisées</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${SITE_URL}" style="background-color: #d4a574; color: #1e3a5f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Commencer à explorer
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Sagesse d'Afrique. Tous droits réservés.
          </p>
        </div>
      `,
    };
  },
};

// Fonctions d'envoi
export async function sendVerificationEmail(email: string, name: string, token: string, lang: string = 'fr') {
  const template = templates.verifyEmail(name, token, lang);
  
  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string, lang: string = 'fr') {
  const template = templates.resetPassword(name, token, lang);
  
  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendWelcomeEmail(email: string, name: string, lang: string = 'fr') {
  const template = templates.welcomeEmail(name, lang);
  
  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

// Vérifier la connexion SMTP au démarrage
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email service connected');
    return true;
  } catch (error) {
    console.warn('⚠️ Email service not configured:', (error as Error).message);
    return false;
  }
}
