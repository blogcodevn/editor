import { ForwardedRef, forwardRef, PropsWithChildren, ReactNode, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface ModalRef {
  open(): void;
  close(): void;
}

export interface ModalProps {
  title?: ReactNode;
  description?: ReactNode;
  opened?: boolean;
  onClose?(): void;
  onOpen?(): void;
  className?: string;
  renderAnchor?(): JSX.Element;
}

function ForwardModal(props: PropsWithChildren<ModalProps>, ref: ForwardedRef<ModalRef>) {
  const { opened = false, onOpen, onClose, children, title, description, renderAnchor, className } = props;
  const [ isOpen, setIsOpen ] = useState(opened);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
      onOpen?.();
    },
    close() {
      setIsOpen(false);
      onClose?.();
    }
  }))

  const handleChangeOpen = (newState: boolean) => {
    setIsOpen(newState);
    newState ? onOpen?.() : onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleChangeOpen}>
      {renderAnchor ? (
        <DialogTrigger asChild>
          {renderAnchor()}
        </DialogTrigger>
      ) : null}
      <DialogContent
        className={className}
        title={title}
        description={description}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

const Modal = forwardRef(ForwardModal);
Modal.displayName = "@blogcode/editor/Modal";
export default Modal;
