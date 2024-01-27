import { FileSystemTree, WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export const useWebContainer = (fileSystem: FileSystemTree) => {
  const [instance, setInstance] = useState<WebContainer>();
  const [serverUrl, setServerUrl] = useState<string>();
  const { data, error, isLoading } = useSWR('bootWebContainer', () => (!instance ? WebContainer.boot() : instance));

  useEffect(() => {
    if (instance) {
      instance.mount(fileSystem);
      instance.on('server-ready', (port, url) => {
        setServerUrl(url);
      });
    }
  }, [!!instance]);

  useEffect(() => {
    if (data) {
      setInstance(data);
    }
  }, [!!data]);

  useEffect(() => {
    console.log('isLoading', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('error', error);
  }, [error]);

  return { webContainer: instance, error, isLoading, serverUrl };
};

export const outputStdout = () => {
  return new WritableStream({
    write(chunk) {
      console.log(chunk);
    },
  });
};
