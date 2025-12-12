import os
import requests
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters, CallbackQueryHandler
from telegram.request import HTTPXRequest 

# --- CONFIG ---
BOT_TOKEN = "8315707153:AAEfKocj4Y1DAVNAAINBRRH2yg9-0R6J9NI" 
BACKEND_URL = "http://127.0.0.1:8000"
OPERATOR_ADDRESS = "0xD8d3e1730c1FAdE75357fa750293620dE00BE1EC"

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# --- HELPER FUNCTION ---
def to_gateway_url(ipfs_uri):
    """Mengubah ipfs://Qm... menjadi https://gateway.pinata.cloud/ipfs/Qm..."""
    if not ipfs_uri or not str(ipfs_uri).startswith("ipfs://"):
        return "N/A"
    return ipfs_uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")

# --- HANDLERS ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 **Halo! Selamat datang di SIGNET (Story Protocol Edition).**\n\n"
        "Kirimkan **Video** atau **Gambar** untuk:\n"
        "🛡️ **Register IP:** Mendaftarkan aset asli ke Blockchain & IPFS.\n"
        "🔍 **Verify/Scan:** Mengecek deepfake/manipulasi.\n\n"
        "🚀 *Silakan upload file kamu sekarang!*",
        parse_mode='Markdown'
    )

async def handle_media(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.message
    media = msg.video or msg.document or msg.photo
    
    is_image = False
    if isinstance(media, list): 
        media = media[-1]
        is_image = True
    elif msg.photo: 
        media = msg.photo[-1]
        is_image = True
        
    file_id = media.file_id
    default_name = "image.jpg" if is_image else "video.mp4"
    file_name = getattr(media, 'file_name', default_name)
    
    context.user_data['current_video_id'] = file_id
    context.user_data['current_filename'] = file_name
    context.user_data['is_image'] = is_image 
    
    keyboard = [
        [InlineKeyboardButton("🛡️ Register as IP Asset", callback_data='register')],
        [InlineKeyboardButton("🔍 Scan for Deepfake", callback_data='verify')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(f"📁 File diterima: `{file_name}`\nApa yang ingin kamu lakukan?", reply_markup=reply_markup, parse_mode='Markdown')

async def list_assets(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("📂 **Mengambil data SIGNET Registry...**")
    try:
        response = requests.get(f"{BACKEND_URL}/list")
        if response.status_code == 200:
            assets = response.json()
            if not assets:
                await update.message.reply_text("📭 Belum ada aset yang terdaftar.")
                return

            msg = "📚 **REGISTERED IP ASSETS:**\n\n"
            for i, asset in enumerate(assets, 1):
                tx_link = f"[Tx]({asset.get('tx_hash', 'https://storyscan.xyz')})" 
                
                raw_ipfs = asset.get('ipfs_metadata', '')
                ipfs_link = f"[Data]({to_gateway_url(raw_ipfs)})" if raw_ipfs else "No Data"

                license_status = "✅ Licensed" if asset.get('license', {}).get('status') == 'ACTIVE' else "⚠️ No License"

                msg += (f"{i}. **{asset.get('filename', 'Asset')}**\n"
                        f"   🆔 ID: `{str(asset['ip_id'])[:8]}...`\n"
                        f"   📜 {license_status}\n"
                        f"   🔗 {tx_link} | 📦 {ipfs_link}\n\n")
            
            if len(msg) > 4000: msg = msg[:4000] + "\n...(truncated)..."
            
            await update.message.reply_text(msg, parse_mode='Markdown', disable_web_page_preview=True)
        else:
            await update.message.reply_text("❌ Gagal mengambil data.")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    action = query.data
    
    if action in ['register', 'verify']:
        file_id = context.user_data.get('current_video_id')
        is_image = context.user_data.get('is_image', False)
        
        if not file_id:
            await query.edit_message_text("❌ Sesi habis. Silakan upload file lagi.")
            return

        await query.edit_message_text(f"⏳ Sedang memproses: {action.upper()}...\nMohon tunggu sebentar (Upload IPFS + Blockchain)...")
        
        new_file = await context.bot.get_file(file_id)
        temp_ext = ".jpg" if is_image else ".mp4"
        file_path = f"temp_tg_media{temp_ext}"
        
        await new_file.download_to_drive(file_path)

        try:
            mime_type = 'image/jpeg' if is_image else 'video/mp4'
            
            with open(file_path, 'rb') as f:
                files = {'file': (file_path, f, mime_type)}
                
                # --- LOGIC REGISTER ---
                if action == 'register':
                    tg_user = query.from_user
                    user_identifier = f"@{tg_user.username}" if tg_user.username else OPERATOR_ADDRESS
                    data = {'owner_name': user_identifier} 
                    
                    response = requests.post(f"{BACKEND_URL}/register", files=files, data=data)
                    
                    if response.status_code == 200:
                        res_json = response.json()
                        if res_json.get('status') == 'SUCCESS':
                            
                            tx_url = f"https://aeneid.storyscan.xyz/tx/{res_json['tx_hash']}"
                            
                            # 🔥 IPFS LINK GENERATION 🔥
                            raw_ipfs = res_json.get('ipfs_metadata', '')
                            ipfs_link = to_gateway_url(raw_ipfs)
                            
                            await query.message.reply_text(
                                f"✅ **IP ASSET REGISTERED!**\n\n"
                                f"🆔 **IP ID:** `{res_json['ip_id']}`\n"
                                f"📜 **License:** {res_json['license_status']}\n"
                                f"🔗 **StoryScan:** [Klik Disini]({tx_url})\n"
                                f"📦 **IPFS Metadata:** [Buka Data]({ipfs_link})\n\n" # <--- INI YG PENTING
                                f"Asset dilindungi dari AI Training & Deepfake.",
                                parse_mode='Markdown',
                                disable_web_page_preview=True
                            )
                        else:
                            msg = res_json.get('msg', 'Registration Failed')
                            await query.message.reply_text(f"🚫 **GAGAL:** {msg}")
                    else:
                        await query.message.reply_text(f"❌ Gagal Register: {response.text}")

                # --- LOGIC VERIFY ---
                elif action == 'verify':
                    response = requests.post(f"{BACKEND_URL}/verify", files=files)
                    res_json = response.json()
                    
                    if res_json['status'] == 'MATCH_FOUND':
                        context.user_data['last_scan'] = {
                            'score': res_json['similarity_percent'],
                            'ip_id': res_json['match_data']['ip_id'],
                            'filename': context.user_data.get('current_filename', 'suspicious_file')
                        }

                        keyboard = [[InlineKeyboardButton("🚨 REPORT SCAM & TAKEDOWN", callback_data=f"report|{res_json['match_data']['ip_id']}")]]
                        reply_markup = InlineKeyboardMarkup(keyboard)
                        
                        await query.message.reply_text(
                            f"⚠️ **VIOLATION DETECTED!**\n\n"
                            f"Target file ini memiliki kemiripan **{res_json['similarity_percent']}%** dengan Aset IP Terdaftar.\n\n"
                            f"🆔 **Original IP:** `{res_json['match_data']['ip_id']}`\n"
                            f"📉 **Distance:** {res_json['distance']}\n\n"
                            f"Sistem merekomendasikan penindakan segera.",
                            reply_markup=reply_markup,
                            parse_mode='Markdown'
                        )
                    else:
                        await query.message.reply_text(
                            "✅ **CLEAN / NO MATCH.**\n"
                            "File ini tidak terdeteksi mirip dengan aset IP manapun di database kami."
                        )

        except Exception as e:
            await query.message.reply_text(f"❌ Error System: {str(e)}")
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

    # --- LOGIC REPORT ---
    elif action.startswith('report|'):
        original_ip_id = action.split('|')[1]
        
        scan_data = context.user_data.get('last_scan', {
            'score': '95', 
            'filename': 'unknown_file'
        })

        await query.message.reply_text("⚖️ **Mengajukan Dispute ke Story Protocol & Membuat Bukti PDF...**")
        
        try:
            payload = {
                'scam_filename': scan_data['filename'], 
                'original_ip_id': original_ip_id,
                'similarity': str(scan_data['score']) 
            }

            response = requests.post(f"{BACKEND_URL}/report", data=payload)
            
            if response.status_code == 200:
                pdf_path = "evidence_proof.pdf"
                with open(pdf_path, 'wb') as f:
                    f.write(response.content)
                
                await query.message.reply_document(
                    document=open(pdf_path, 'rb'),
                    caption=f"✅ **BUKTI PELAPORAN RESMI**\n\n"
                            f"Target: `{scan_data['filename']}`\n"
                            f"Similarity: `{scan_data['score']}%`\n"
                            "Transaksi Dispute telah tercatat di Blockchain."
                )
                os.remove(pdf_path)
            else:
                await query.message.reply_text("❌ Gagal membuat PDF.")
                
        except Exception as e:
            await query.message.reply_text(f"❌ Error Report: {str(e)}")

if __name__ == '__main__':
    print("🤖 SIGNET Bot is waking up...")
    t_request = HTTPXRequest(connection_pool_size=8, read_timeout=180, write_timeout=180, connect_timeout=60)
    app = ApplicationBuilder().token(BOT_TOKEN).request(t_request).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("list", list_assets))
    app.add_handler(MessageHandler(filters.VIDEO | filters.Document.VIDEO | filters.PHOTO, handle_media))
    app.add_handler(CallbackQueryHandler(button_callback))

    print("🚀 Bot Polling Started!")
    app.run_polling()