import { PackageJson } from 'type-fest';

declare module '*.json' {
  const value: PackageJson;
  export default value;
}
