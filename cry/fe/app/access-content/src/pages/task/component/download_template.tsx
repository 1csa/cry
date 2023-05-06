import React from 'react';
import { TEMPLATE_FILES, BASE_LOCAL_API} from "../../../config/constant";
interface DownloadTemplateProps{
}
const DownloadTemplate: React.FC<DownloadTemplateProps> = () => {
  return (
    <div style={{marginTop: '20px'}}>
      模板下载:
      {TEMPLATE_FILES.map((file: string) => {
        return <a key={`${file}`} href={`${BASE_LOCAL_API}/static/assets/${file}`} style={{marginLeft: '20px'}}>{file}</a>
      })}
    </div>
  );
}
export default DownloadTemplate;
