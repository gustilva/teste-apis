import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface SweetAlertOptions {
    title?: string,
    text: string,
    html?: string,
    icon?: SweetAlertIcon,
    confirmAction?: () => void,
    rejectAction?: () => void,
    confirmButtonText?: string,
    showCancelButton?: boolean,
    reverseButtons?: boolean,
    showCloseButton?: boolean,
    cancelButtonColor?: string,
    confirmButtonColor?: string,
    cancelButtonText?: string,
    footer?: string
}

const MySwal = withReactContent(Swal);

export const Sweetalert = async (options: SweetAlertOptions): Promise<boolean> => {
    const result = await MySwal.fire({
        title: options.title,
        text: options.text,
        html: options.html,
        icon: options.icon,
        showCancelButton: options.showCancelButton || false,
        confirmButtonText: options.confirmButtonText || 'Ok',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        cancelButtonColor: options.cancelButtonColor || '#d33',
        confirmButtonColor: options.confirmButtonColor || '#3085d6',
        reverseButtons: options.reverseButtons || false,
        showCloseButton: options.showCloseButton || false,
        footer: options.footer
    });

    if (result.isConfirmed) {
        if (options.confirmAction) {
            options.confirmAction();
        }
        return true;
    } else {
        if (options.rejectAction) {
            options.rejectAction();
        }
        return false;
    }
};
