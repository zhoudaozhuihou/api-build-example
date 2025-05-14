import { useSelector } from 'react-redux';
import { selectUserPermissions, hasPermission, selectCurrentUser } from '../redux/slices/auth/userSlice';

/**
 * 权限检查 Hook，用于检查当前用户是否有特定权限
 * @returns {Object} 权限检查相关的方法和属性
 */
const usePermission = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userPermissions = useSelector(
    state => selectUserPermissions(state, currentUser?.id)
  );

  /**
   * 检查用户是否有特定权限
   * @param {string|string[]} requiredPermissions - 需要检查的权限ID或权限ID数组
   * @param {boolean} requireAll - 是否需要满足所有权限，默认只需满足一个
   * @returns {boolean} 用户是否有权限
   */
  const checkPermission = (requiredPermissions, requireAll = false) => {
    if (!currentUser) return false;
    
    // 如果没有指定权限，则直接返回true
    if (!requiredPermissions || (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)) {
      return true;
    }
    
    // 如果是字符串，转换为数组
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];
    
    if (requireAll) {
      // 必须拥有所有指定权限
      return permissions.every(p => hasPermission(userPermissions, p));
    } else {
      // 只需拥有任一指定权限
      return permissions.some(p => hasPermission(userPermissions, p));
    }
  };

  /**
   * 检查用户是否为超级管理员
   * @returns {boolean} 是否为超级管理员
   */
  const isAdmin = () => {
    if (!currentUser) return false;
    return currentUser.userGroups && currentUser.userGroups.includes('ug1'); // 管理员组ID
  };

  /**
   * 条件渲染组件的高阶组件，如果用户有权限则渲染组件，否则渲染空内容或备用内容
   * @param {React.ReactNode} children - 子组件
   * @param {string|string[]} requiredPermissions - 需要检查的权限ID或权限ID数组
   * @param {boolean} requireAll - 是否需要满足所有权限，默认只需满足一个
   * @param {React.ReactNode} fallback - 无权限时显示的备用内容
   * @returns {React.ReactNode} 根据权限条件渲染的内容
   */
  const PermissionGuard = ({ children, requiredPermissions, requireAll = false, fallback = null }) => {
    if (checkPermission(requiredPermissions, requireAll) || isAdmin()) {
      return children;
    }
    return fallback;
  };

  return {
    checkPermission,
    isAdmin,
    userPermissions,
    PermissionGuard
  };
};

export default usePermission; 