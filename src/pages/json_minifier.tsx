import MainContent from '@/components/MainContent';
import alert from '@/components/Alert';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

// const jsonmin = (text: string) => {
//   return text.replace(/\s{0,}\{\s{1,}/g,"{")
//           .replace(/\s{0,}\[$/g,"[")
//           .replace(/\[\s{0,}/g,"[")
//           .replace(/:\s{0,}\[/g,':[')
//           .replace(/\s{1,}\}\s{0,}/g,"}")
//           .replace(/\s{0,}\]\s{0,}/g,"]")
//           .replace(/\"\s{0,}\,/g,'",')
//           .replace(/\,\s{0,}\"/g,',"')
//           .replace(/\"\s{0,}:/g,'":')
//           .replace(/:\s{0,}\"/g,':"')
//           .replace(/:\s{0,}\[/g,':[')
//           .replace(/\,\s{0,}\[/g,',[')
//           .replace(/\,\s{2,}/g,', ')
//           .replace(/\]\s{0,},\s{0,}\[/g,'],[')
//           .replace(/\n/g, "");
// }

const _C = () => {
  const [json, setJson] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const compressJSON = async (v: string) => {
    try {
      const result = JSON.stringify(JSON.parse(v));
      setResult(result);
      setError('');
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([result], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'compressed';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const handleClick = useCallback(() => {
    alert.success('复制成功');
  }, []);

  const handleButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const content = e.target.result;
          setJson(content);
          setError('');
        };

        reader.readAsText(file);
      } else {
        setJson('');
        setError('Invalid file type.');
      }
      event.target.value = '';
    }
  };

  useEffect(() => {
    if (json.trim() === '') {
      setResult('');
      setError('');
      return;
    }
    compressJSON(json);
  }, [json]);

  return (
    <MainContent>
      <Box
        sx={{
          '#ace-editor *': {
            fontFamily: 'Mono',
          },
        }}
      >
        <Stack
          sx={{ mb: 2 }}
          justifyContent={'center'}
          direction={'row'}
          spacing={2}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Typography>JSON 内容</Typography>
            <Box>
              <Button size='small' onClick={() => setJson('')}>
                清空
              </Button>
              <Button
                size='small'
                variant='outlined'
                onClick={handleButtonClick}
              >
                上传 JSON
              </Button>
            </Box>
          </Stack>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Typography>压缩结果</Typography>
            <Box>
              <CopyToClipboard text={result} onCopy={handleClick}>
                <Button size='small' disabled={!result}>
                  复制
                </Button>
              </CopyToClipboard>
              <Button
                size='small'
                variant='contained'
                disabled={!!error || !result}
                onClick={handleDownloadJSON}
              >
                导出 JSON
              </Button>
            </Box>
          </Stack>
        </Stack>
        <Stack direction={'row'} spacing={3}>
          <AceEditor
            name='a'
            fontSize={16}
            style={{
              width: '100%',
              borderRadius: '4px',
              height: 'calc(100vh - 310px)',
            }}
            value={json}
            mode='json'
            theme='monokai'
            onChange={setJson}
            editorProps={{ $blockScrolling: true }}
          />
          <AceEditor
            name='b'
            fontSize={16}
            style={{
              width: '100%',
              borderRadius: '4px',
              height: 'calc(100vh - 310px)',
            }}
            value={error || result}
            mode='json'
            theme='monokai'
            readOnly
            wrapEnabled
            editorProps={{ $blockScrolling: true }}
          />
        </Stack>
        <Box
          component={'input'}
          id='fileInput'
          type='file'
          accept={'.json'}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
    </MainContent>
  );
};

export default _C;
