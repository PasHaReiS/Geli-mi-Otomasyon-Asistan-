import JSZip from 'jszip';
import { GeneratedProject } from './codeGenerator';

export async function downloadProjectAsZip(project: GeneratedProject, zipFilename = 'gelismis_otomasyon_bot.zip') {
  const zip = new JSZip();

  // Create root files and folders
  project.files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Create an empty modules/__init__.py
  zip.file('modules/__init__.py', '# Modules package\n');

  // Create README.md
  zip.file(
    'README.md',
    `# Gelişmiş Oyun Otomasyon Asistanı (Advanced Game Bot)

Bu proje AI Studio Bot Orchestrator tarafından oluşturulmuştur.

## Kurulum ve Çalıştırma

1. Bilgisayarınızda Python 3.8+ kurulu olduğundan emin olun.
2. Emülatörünüzü (LDPlayer, BlueStacks, Nox vb.) açın ve ADB ayarlarının açık olduğunu kontrol edin.
3. Windows kullanıyorsanız:
   - Hazır ayarlarla hemen başlatmak için \`baslat.bat\` dosyasına çift tıklayın!
   - Veya IP ve Port sorarak otomatik yapılandırma yapmak için \`install.bat\` dosyasını çalıştırın.
4. Linux / VPS / Ubuntu kullanıyorsanız:
   \`\`\`bash
   chmod +x install.sh
   ./install.sh
   \`\`\`
5. Manuel çalıştırmak isterseniz:
   \`\`\`bash
   pip install -r requirements.txt
   python3 main.py
   \`\`\`

## Modül Ekleme & Çıkarma
\`main.py\` içerisindeki \`AKTIF_GOREVLER\` listesine dilediğiniz modülü ekleyip çıkarabilirsiniz:
\`\`\`python
AKTIF_GOREVLER = ["modules.gather", "modules.monster", "modules.rally"]
\`\`\`
`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
